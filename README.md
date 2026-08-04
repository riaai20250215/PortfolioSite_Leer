# りあ / Leer — AI CREATOR 公式サイト

AIクリエイター **りあ / Leer**([@ria_aicreator](https://x.com/ria_aicreator))の公式サイト。
テーマは **PRISM NIGHT** — Xアイコン(黒背景 × 虹色の髪 × 金の星)に合わせた、深い夜空にプリズムの光が差すデザイン。

参考構成: [neruko.xyz](https://neruko.xyz/)(GOODS/MUSICセクションを除いたワンページ構成)

## 構成

| セクション | 内容 |
|---|---|
| TOP | 「LEER」の名前のみのシンプル構成(背景: ナイモノネダリのキービジュアル + 星空 + 名前がふわっと浮かぶ登場アニメ)。SNSリンクと JP/EN 言語切替はヘッダー右上 |
| NEWS | 受賞・出品・公開のお知らせ |
| WORKS | 8作品を投稿時期の新しい順に掲載(ルミア / 真夜中の自分会議 / ポスト・アニマ / ナイモノネダリ / The Lost Celestia / 人間(仮)、はじめます。 / Still shining / 声の羅針盤) |
| CHARACTER | **一時非表示中**(2026-08-03)。ニル / NIL の紹介とビジュアル系譜(v1〜v6)。`index.html` 内にコメントアウトで保持。再表示はコメントブロックを外し、navの CHARACTER リンクも復活させる |
| PROFILE | プロフィールと経歴タイムライン |
| LINKS | X / YouTube / Instagram / TikTok |

## ファイル

- `public/index.html` — 全コンテンツ(ニュース・作品説明の文言はここを編集)
- `public/style.css` — PRISM NIGHTテーマ(冒頭の`:root`で配色を一括変更可)
- `public/script.js` — 星空canvas / スクロール演出 / モバイルナビ / ライトボックス / JP・EN言語切替(英訳辞書 `EN` はこのファイル内。テキスト変更時は `data-i18n` キーと対で更新)
- `public/assets/` — Web用に軽量化した画像(works / character / profile)

## ローカルプレビュー

```bash
npm run dev
# → http://127.0.0.1:8931/
```

## デプロイ (Cloudflare Workers)

post-anima / nil-official と同じ Workers 静的アセット配信。

```bash
npm install
npm run deploy
# → https://leer-official.official-leer.workers.dev/
```

## 更新メモ

- ニュース追加: `index.html` の `#news` 内 `<li class="news-item">` を先頭にコピーして追記
- 作品追加: `#works` 内 `<article class="work-card">` をコピー、画像は `public/assets/works/` へ(横1280px・JPEG推奨)
- 作品カードのサムネイルは各作品の公式サムネ(真夜中の自分会議/ナイモノネダリ=制作フォルダ、人間(仮)/Still shining/The Lost Celestia=YouTubeサムネ)。声の羅針盤はCodexで生成した正式版(採用元: PocketANIMEリポジトリ `画像/サムネイル/.../final/koe_no_rashinban_title_01_literary.png`、旧版は `.backup/` に保管)
- 作品リンク: ナイモノネダリ/人間(仮)=X作品ポスト、人間(仮)/声の羅針盤=YouTube、ポスト・アニマ=公式紹介サイト
