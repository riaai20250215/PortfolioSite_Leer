# TALK BACK の掲載とニュースの「もっと見る」（2026-10-20・Claude）

## 依頼（りあさん）
- ハッカソンの『TALK BACK』を代表作の上の段の真ん中に置き、ポスト・アニマと人間（仮）は下の段に。
- 「詳細を見る」は X の作品ポストの内容（ハッシュタグなし）。受賞は ARENA PEAK ASIA の「日本地域賞」と「入選賞（新人賞）」。役割は投稿の記載だけ。
- NEWS に今回の実績を足す。NEWS は最大5件だけ出し、残りは「もっと見る」で開く。
- 公開まで。

## やったこと
- content-render.js：series に `lead: true` を足すと、1枚目のカードが上の段の真ん中に、ほかのカードと同じ幅で置かれる（`.works-grid.cols-2.lead-first`。スマホでは全幅）。NEWS は先頭5件（`NEWS_SHOWN`）だけ出し、6件目からは `.is-extra`、最後に「もっと見る（N）」のボタン（script.js が `.news-list` の `is-open` を付け外し。英訳は Show more／Show less）。
- content.json：作品 `w-talkback`（バッジ award「日本地域賞・入選賞」、リンクは作品ポスト x.com/ria_aicreator/status/2112173901082157068）、代表作の説明文を3作に合わせて直した、NEWS の先頭に受賞（受賞報告ポスト 2111806895304671305 へのリンク）、年表に 2026.10「TALK BACK 🏆」。
- サムネイル：`public/assets/works/talk-back.jpg`（X 投稿版の動画の最初のコマ＝X の投稿のサムネイルの絵。1280×720）。
- `npm run build && npm test`（12 news / 21 works で OK）→ `XDG_CONFIG_HOME=~/.wrangler-ria npm run deploy`（版 43cdb5f8）→ KV に PUT（200）。/api/content・talk-back.jpg・style.css が新しい中身を返すのを curl で確かめた。

## 確かめたこと・推測
- 賞の名前：TapNow の大会ページの公開データ（/api/community/events/66）の賞の表は「Arena Peak Japan」（日本地域賞）と「入围奖」（入選。3会場で58チーム）。「新人賞」は表になく、りあさんの X の2つの投稿も「日本地域賞」「入選賞」なので、「入選賞」で載せた。
- 画面での見た目は確かめていない（りあさんに任せる）。
- git のコミット・プッシュはしていない。
