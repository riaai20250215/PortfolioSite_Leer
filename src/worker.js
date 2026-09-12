/* =====================================================
   りあ / Leer — Official Site Worker
   ---------------------------------------------------
   静的アセット配信 (assets) はそのまま。ここでは /api/* だけを処理する。

     GET  /api/content   … KV に保存された最新コンテンツ (無ければ同梱の content.json)
     PUT  /api/content   … 管理画面からの保存 (要認証)
     GET  /api/status    … 認証方式が設定済みかどうかの確認用

   認証は次のどちらか (両方設定してもよい):
     A. Cloudflare Access …… ACCESS_TEAM_DOMAIN と ACCESS_AUD を設定
        管理画面と /api/* を Access で保護し、Cf-Access-Jwt-Assertion を検証する
     B. 共有トークン ……… wrangler secret put ADMIN_TOKEN
        Authorization: Bearer <token> を検証する
        (workers.dev のままで Access を使えない場合はこちら)

   どちらも未設定なら PUT は 503 を返す = 書き込み口が開きっぱなしにならない。
   ===================================================== */
import { validateContent } from '../public/content-render.js';

const KV_KEY = 'site-content';
const DEFAULT_ORIGINS = [
  /^https:\/\/leer-creative-archive\.[a-z0-9-]+\.workers\.dev$/i,
  /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) {
      // run_worker_first の設定次第ではここに来ないが、来ても静的アセットへ委譲する
      return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not found', { status: 404 });
    }

    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    if(url.pathname==='/api/auth'&&request.method==='GET'){
      const auth=await authorize(request,env);
      return json(auth.ok?{ok:true,canWrite:Boolean(env.SITE_CONTENT)}:{ok:false,error:'本番への接続を確認できませんでした。'},auth.ok?200:auth.status,cors);
    }

    if (url.pathname === '/api/status' && request.method === 'GET') {
      return json(
        {
          ok: true,
          kv: Boolean(env.SITE_CONTENT),
          auth: {
            accessConfigured: Boolean(env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD),
            tokenConfigured: Boolean(env.ADMIN_TOKEN)
          }
        },
        200,
        cors
      );
    }

    if (url.pathname !== '/api/content') return json({ ok: false, error: 'Not found' }, 404, cors);

    if (request.method === 'GET') return getContent(request, env, cors);
    if (request.method === 'PUT' || request.method === 'POST') return putContent(request, env, cors, ctx);
    return json({ ok: false, error: 'Method not allowed' }, 405, { ...cors, allow: 'GET, PUT, OPTIONS' });
  }
};

/* ---------- GET ---------- */
async function getContent(request, env, cors) {
  const headers = { ...cors, 'cache-control': 'no-store' };
  if (env.SITE_CONTENT) {
    const stored = await env.SITE_CONTENT.get(KV_KEY);
    if (stored) {
      return new Response(stored, {
        headers: { ...headers, 'content-type': 'application/json; charset=utf-8', 'x-content-source': 'kv', etag:await revision(stored) }
      });
    }
  }
  // KV が未設定 / 未保存ならリポジトリ同梱の content.json を返す
  if (env.ASSETS) {
    const assetUrl = new URL('/content.json', request.url);
    const asset = await env.ASSETS.fetch(new Request(assetUrl, { method: 'GET' }));
    if (asset.ok) {
      const body=await asset.text();
      return new Response(body, {
        headers: { ...headers, 'content-type': 'application/json; charset=utf-8', 'x-content-source': 'static', etag:await revision(body) }
      });
    }
  }
  return json({ ok: false, error: 'content が見つかりません' }, 404, headers);
}

/* ---------- PUT ---------- */
async function putContent(request, env, cors, ctx) {
  if (!env.SITE_CONTENT) {
    return json({ ok: false, error: 'KV バインディング SITE_CONTENT が未設定です' }, 503, cors);
  }

  const auth = await authorize(request, env);
  if (!auth.ok) return json({ ok: false, error: auth.error }, auth.status, cors);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'JSON を解析できませんでした' }, 400, cors);
  }

  const problems = validateContent(payload);
  if (problems.length) return json({ ok: false, error: '検証エラー', problems }, 422, cors);

  // Editors send the revision they loaded, so stale pages do not overwrite newer edits.
  const expected=request.headers.get('if-match');
  const previous = await env.SITE_CONTENT.get(KV_KEY);
  if(expected){
    let current=previous;
    if(!current){const response=await getContent(request,env,cors);current=await response.text();}
    if(expected!==await revision(current))return json({ok:false,error:'別の画面で本番が更新されました。下書きを残して、本番から再読込してください。'},412,cors);
    if(JSON.stringify(JSON.parse(current))===JSON.stringify(payload))return json({ok:true,unchanged:true,savedAt:payload.savedAt||null,revision:await revision(current)},200,cors);
  }
  const now = new Date().toISOString();
  const next = { ...payload, version: payload.version ?? 1, updatedAt: payload.updatedAt || now.slice(0, 10), savedAt: now };
  const body = JSON.stringify(next, null, 2);
  if (body.length > 400_000) return json({ ok: false, error: 'コンテンツが大きすぎます (400KB 上限)' }, 413, cors);

  // 直前の内容を1世代だけ退避しておく (取り違え時の巻き戻し用)
  if (previous) {
    const backup = env.SITE_CONTENT.put(`${KV_KEY}:previous`, previous);
    if (ctx?.waitUntil) ctx.waitUntil(backup); else await backup;
  }
  await env.SITE_CONTENT.put(KV_KEY, body);

  return json({ ok: true, savedAt: now, revision:await revision(body), by: auth.identity }, 200, cors);
}

/* ---------- 認証 ---------- */
async function authorize(request, env) {
  const accessConfigured = Boolean(env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD);
  const tokenConfigured = Boolean(env.ADMIN_TOKEN);
  if (!accessConfigured && !tokenConfigured) {
    return { ok: false, status: 503, error: '認証が未設定です。ADMIN_TOKEN か Cloudflare Access を設定してください' };
  }

  if (tokenConfigured) {
    const header = request.headers.get('authorization') || '';
    const token = header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
    if (token && timingSafeEqual(token, env.ADMIN_TOKEN)) return { ok: true, identity: 'admin-token' };
  }

  if (accessConfigured) {
    const jwt = request.headers.get('cf-access-jwt-assertion');
    if (jwt) {
      const identity = await verifyAccessJwt(jwt, env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD);
      if (identity) return { ok: true, identity };
    }
  }

  return { ok: false, status: 401, error: '認証に失敗しました' };
}

function timingSafeEqual(a, b) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}

/* Cloudflare Access の JWT (RS256) を JWKS で検証する */
let jwksCache = { at: 0, keys: null };
async function verifyAccessJwt(token, teamDomain, aud) {
  try {
    const [rawHeader, rawPayload, rawSignature] = token.split('.');
    if (!rawHeader || !rawPayload || !rawSignature) return null;
    const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(rawHeader)));
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(rawPayload)));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    if (payload.nbf && payload.nbf > now + 60) return null;
    const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audience.includes(aud)) return null;

    const host = teamDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (payload.iss && !payload.iss.includes(host)) return null;

    if (Date.now() - jwksCache.at > 60 * 60 * 1000 || !jwksCache.keys) {
      const response = await fetch(`https://${host}/cdn-cgi/access/certs`);
      if (!response.ok) return null;
      jwksCache = { at: Date.now(), keys: (await response.json()).keys || [] };
    }
    const jwk = jwksCache.keys.find(key => key.kid === header.kid);
    if (!jwk) return null;

    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      base64UrlDecode(rawSignature),
      new TextEncoder().encode(`${rawHeader}.${rawPayload}`)
    );
    return valid ? payload.email || 'cf-access' : null;
  } catch {
    return null;
  }
}

function base64UrlDecode(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/* ---------- CORS ---------- */
function corsHeaders(request, env) {
  const origin = request.headers.get('origin');
  const headers = {
    'access-control-allow-methods': 'GET, PUT, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization, if-match',
    'access-control-expose-headers': 'etag',
    'access-control-max-age': '86400',
    vary: 'Origin'
  };
  if (!origin) return headers;

  const extra = String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
  const allowed = extra.includes(origin) || DEFAULT_ORIGINS.some(re => re.test(origin));
  if (allowed) {
    headers['access-control-allow-origin'] = origin;
    headers['access-control-allow-credentials'] = 'true';
  }
  return headers;
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

async function revision(body){const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(body));return '"'+Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')+'"';}
