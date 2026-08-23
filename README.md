# りあ / Leer — AI CREATOR 公式サイト

AIクリエイター **りあ / Leer**([@ria_aicreator](https://x.com/ria_aicreator))の公式サイト。
テーマは **PRISM NIGHT** — Xアイコン(黒背景 × 虹色の髪 × 金の星)に合わせた、深い夜空にプリズムの光が差すデザイン。

参考構成: [neruko.xyz](https://neruko.xyz/)(GOODS/MUSICセクションを除いたワンページ構成)

## 構成

| セクション | 内容 |
|---|---|
| TOP | 「LEER」の名前のみのシンプル構成(背景: ナイモノネダリのキービジュアル + 星空 + 名前がふわっと浮かぶ登場アニメ)。SNSリンクと JP/EN 言語切替はヘッダー右上 |
| NEWS | 受賞・出品・公開のお知らせ |
| WORKS | 9作品を投稿時期の新しい順に掲載(正論アレルギー / ルミア / 真夜中の自分会議 / ポスト・アニマ / ナイモノネダリ / The Lost Celestia / 人間(仮)、はじめます。 / Still shining / 声の羅針盤) |
| CHARACTER | **一時非表示中**(2026-08-03)。ニル / NIL の紹介とビジュアル系譜(v1〜v6)。`index.html` 内にコメントアウトで保持。再表示はコメントブロックを外し、navの CHARACTER リンクも復活させる |
| PROFILE | プロフィールと経歴タイムライン |
| LINKS | X / YouTube / Instagram / TikTok |

## ファイル

- `public/content.json` — **NEWS / WORKS / PROFILE / LINKS の正本**(管理画面から編集するのもこの内容)
- `public/index.html` — ページの骨格 + `content.json` から生成した静的HTML(JSONが読めないときのフォールバック)
- `public/content-render.js` — content.json → HTML の共有レンダラ(ブラウザ・ビルド・Worker で共用)
- `public/content.js` — 実行時に `/api/content` → `content.json` の順で読み、変化があった部分だけ描き直す
- `public/style.css` — PRISM NIGHTテーマ(冒頭の`:root`で配色を一括変更可)
- `public/script.js` — 星空canvas / スクロール演出 / モバイルナビ / ライトボックス / JP・EN言語切替(英訳辞書 `EN` の大半は `npm run build` が content.json から生成)
- `public/assets/` — Web用に軽量化した画像(works / character / profile)
- `src/worker.js` — `GET /api/content` / `PUT /api/content`(Cloudflare KV + 認証)

> このリポジトリは**公開**です。管理画面のURL・運用手順・設定手順は、非公開リポジトリ `leer-creative-archive` の `DEPLOY-ADMIN.md` にあります。

### コンテンツを直す2つの方法

1. **管理画面**(推奨): `leer-creative-archive/public/admin/` で編集 → 「公開サイトへ反映」→ KV に保存され即時反映
2. **リポジトリ**: `public/content.json` を編集 → `npm run build`(静的HTMLと英訳辞書を再生成)→ `npm test` → `npm run deploy` → **KV へ反映**

> ⚠️ 2 の場合、`npm run deploy` だけでは表示は変わりません。
> 実行時レンダラは `/api/content`(KV) → `content.json` の順で読むため、KV に保存済みの内容が常に勝ちます。デプロイ後に必ず KV も更新してください。
> ```bash
> curl -X PUT https://leer-official.official-leer.workers.dev/api/content \
>   -H "authorization: Bearer $ADMIN_TOKEN" -H "content-type: application/json" \
>   --data-binary @public/content.json
> ```
> (`ADMIN_TOKEN` は非公開の `.deploy-credentials.env`。Worker が旧内容を `content:previous` に自動バックアップします)

`index.html` の NEWS / WORKS / PROFILE / LINKS を直接手で書き換えないでください
(`npm test` が content.json とのズレを検出して落ちます)。

## ローカルプレビュー

```bash
npm run dev
# → http://127.0.0.1:8940/
```

## デプロイ (Cloudflare Workers)

post-anima / nil-official と同じ Workers 静的アセット配信。

```bash
npm install
npm run deploy
# → https://leer-official.official-leer.workers.dev/
```

## 更新メモ

- ニュース追加: 管理画面の NEWS タブで「＋ 追加」(または `public/content.json` の `news` 先頭に追記 → `npm run build`)
- 作品追加: 管理画面の WORKS タブで「＋ 追加」。画像だけは先に `public/assets/works/` へ置いてデプロイが必要(横1280px・JPEG推奨)
- 作品カードのサムネイルは各作品の公式サムネ(真夜中の自分会議/ナイモノネダリ=制作フォルダ、人間(仮)/Still shining/The Lost Celestia=YouTubeサムネ)。声の羅針盤はCodexで生成した正式版(採用元: PocketANIMEリポジトリ `画像/サムネイル/.../final/koe_no_rashinban_title_01_literary.png`、旧版は `.backup/` に保管)
- 作品リンク: ナイモノネダリ/人間(仮)=X作品ポスト、人間(仮)/声の羅針盤=YouTube、ポスト・アニマ=公式紹介サイト
- 正論アレルギー(2026-08-22追加): 自主制作MV。サムネは制作フォルダの `サムネイル.png` を横1280pxのJPEGに変換。リンクは YouTube(ニル名義チャンネル @nil_artist_official) + X作品ポストの2本
