# りあ / Leer — AI CREATOR 公式サイト

AIクリエイター **りあ / Leer**([@ria_aicreator](https://x.com/ria_aicreator))の公式サイト。
テーマは **PRISM NIGHT** — Xアイコン(黒背景 × 虹色の髪 × 金の星)に合わせた、深い夜空にプリズムの光が差すデザイン。

参考構成: [neruko.xyz](https://neruko.xyz/)(GOODS/MUSICセクションを除いたワンページ構成)

## 構成

| セクション | 内容 |
|---|---|
| TOP | 「LEER」の名前のみのシンプル構成(背景: ナイモノネダリのキービジュアル + 星空 + 名前がふわっと浮かぶ登場アニメ)。SNSリンクと JP/EN 言語切替はヘッダー右上 |
| NEWS | 受賞・出品・公開のお知らせ |
| WORKS | 13作品を**シリーズごと**に掲載。代表作(ポスト・アニマ / 人間(仮)、はじめます。、2列で大きく) → Penny's House シリーズ(MIDNIGHT MART / ONE SMALL MOMENT / PLATFORM、縦型 9:16 サムネ) → NiL シリーズ(正論アレルギー / 真夜中の自分会議 / 神様へのクレーム窓口 / ナイモノネダリ) → その他の作品(ルミア / The Lost Celestia / Still shining / 声の羅針盤)。各シリーズの見出しには公式アカウント(YouTube / Instagram / TikTok)のリンク。**作品の説明文は既定で閉じたアコーディオン**(「詳細を見る」/ details・summary) |
| CHARACTER | **一時非表示中**(2026-08-03)。ニル / NIL の紹介とビジュアル系譜(v1〜v6)。`index.html` 内にコメントアウトで保持。再表示はコメントブロックを外し、navの CHARACTER リンクも復活させる |
| PROFILE | プロフィールと経歴タイムライン |
| LINKS | X / YouTube / Instagram / TikTok |

## ファイル

- `public/content.json` — **NEWS / WORKS / PROFILE / LINKS の正本**(管理画面から編集するのもこの内容)
  - `series` 配列 = WORKS のシリーズ見出し(`id` / `kicker` / `titleJa` / `titleEn` / `descJa` / `descEn` / `links[{icon,name,handle,href}]`)。`orientation: "vertical"` を付けると、そのシリーズだけサムネイルを 9:16 で並べ、見出しからカードまでブロックごと幅 820px に絞る(縦型動画用。スマホ幅では左サムネ・右本文の横並びになる)。`columns: 2` で2列(作品が2本のシリーズを大きく見せる用)
  - 各作品の `badgeType` = `award`(受賞: 金のきらめき+トロフィー) / `honor`(ノミネート・選考通過: 銀の縁と ✦) / `default`(参加・自主制作)。未指定ならバッジ文が 🏆 で始まるときだけ award 扱い。🏆 はアイコンで示すので文字には入れない
  - 各作品の `series` にシリーズの `id` を入れるとその見出しの下にまとまる。`series` が無い作品は最後の「その他の作品」に入る(シリーズを1つも定義しなければ、従来どおりカードだけが並ぶ)
  - 管理画面の WORKS フォームには `series` の入力欄がまだ無い。シリーズの追加・所属の変更は管理画面の JSON 欄か、このファイルを直接編集する
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
> (`ADMIN_TOKEN` は非公開の `.deploy-credentials.env`。Worker が旧内容を `site-content:previous` に自動バックアップします)

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
- 説明文のアコーディオン(2026-09-11追加): 作品カードの説明文は `details`/`summary` で**既定は閉じた状態**(「詳細を見る」→ 開くと「閉じる」)。JSなしで開閉でき、閉じている間はカードの高さが揃う。開閉ラベルの英訳 `t-more` / `t-less` は `script.js` の EN 辞書の**マーカー外**に手書きしてあるので `npm run build` で消えない
- シリーズ表示(2026-09-11追加): Penny's House シリーズ(BLANK ROOM 名義、YouTube `@BLANK-ROOM-0902` / Instagram・TikTok `blank.room.20260904`)と NiL シリーズ(YouTube `@nil_artist_official`)を新設。MIDNIGHT MART / ONE SMALL MOMENT / PLATFORM は縦型なのでサムネは 720×1280 JPEG(採用サムネ: PLATFORM=`005_PLATFORM_縦型MV/サムネイル候補/採用_platform_03_home`、MIDNIGHT MART=`02_image_material/94_サムネイル_3案/A_自撮りの違和感_9x16`。ONE SMALL MOMENT は未採用のため候補②「夜の3人スナップ」を仮置き)。神様へのクレーム窓口は NiL 公式サイトの `assets/kamisama/cover.jpg` を 1280×720 に切り出し。リンクは YouTube ショート / TikTok の各動画(ONE SMALL MOMENT は TikTok のみ公開)
- 掲載順(2026-09-11): りあさん指示で **代表作(ポスト・アニマ / 人間(仮)、はじめます。)を先頭**に置いた。「長編のアニメ作品で成果も出ているのでトップに」という理由。グループ名は「長編」と書くと `人間(仮)` のメタ表記 `SHORT ANIME (約10分)` と矛盾するため「代表作 / FEATURED」にしてある
- バッジ3段階(2026-09-11): りあさん指示「受賞はひと目で分かるキラキラしたラベルに、『縦型MV』『オリジナル曲』の表記は微妙」→ `badgeType` を導入。受賞は金のグラデーションが流れる(`badgeShine`)+右上で光の粒がまたたく(`badgeTwinkle`)。NEWS の AWARD 帯も同じきらめき。`prefers-reduced-motion` では止める。縦型サムネは曲名が上に焼き込まれているのでバッジは下寄せ
- MIDNIGHT MART の受賞(2026-09-11): Super 30s Creation Cup 2026(SousakuAI × Wan 3.0)**ホラー部門 優秀賞**(結果画像の公式表記は「ホラー部門優秀賞 / Category Excellence Award」、部門3名。りあさんは「最優秀賞」と呼んだが公式表記に合わせた)。NEWS 先頭に追加、作品ポストは https://x.com/ria_aicreator/status/2096525255330394248

