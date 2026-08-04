# Claude Code用メタプロンプト — 「声の羅針盤」採用サムネイルのサイト反映

あなたは `leer-official-site` の実装を担当するClaude Codeです。以下の採用決定に従い、公式サイトのWORKSカードへサムネイルを反映してください。

## 引き継ぎ状況

- Codex側でサムネイルの構成検討、画像生成、タイトルデザインの3案比較、320×180での目視確認まで完了しています。
- ユーザーは3案中の「1枚目／静かな文芸調」を正式採用しました。
- 今回は新しい画像を生成しないでください。下記の採用済み画像をそのまま使用してください。
- Codex側ではサイトへの配置・デプロイは実施していません。ここからの反映作業がClaude Codeの担当です。

## 採用元画像（唯一の正）

絶対パス：

```text
/Users/maruokatsuyoshi1/Downloads/01)AI/00)コンペ提出作品/20250331_PocketANIME World Competition/画像/サムネイル/koe_no_rashinban_variant10_pop_revisions/title_redesign_3patterns/final/koe_no_rashinban_title_01_literary.png
```

この画像は次の仕様を満たしています。

- 作品名：`声の羅針盤`
- 16:9横長のアニメ調サムネイル
- 主人公とヒロインのリアル／配信／イベント姿、計6姿
- 下中央に枠なしの文芸調タイトル
- コピー、英字、タイトル背景の四角い枠なし
- ライブ配信を示すマイク、波形、配信光、黄金の羅針盤
- カップル・恋愛を前面に出さない構図

別案02・03や、過去の仮タイトル版を採用しないでください。

## 対象サイト

```text
/Users/maruokatsuyoshi1/Downloads/01)AI/00)コンペ提出作品/leer-official-site
```

現在のWORKSカードは以下を参照しています。

```html
<img src="assets/works/koe-no-rashinban-thumb.jpg" alt="声の羅針盤 サムネイル" loading="lazy">
```

反映先：

```text
/Users/maruokatsuyoshi1/Downloads/01)AI/00)コンペ提出作品/leer-official-site/public/assets/works/koe-no-rashinban-thumb.jpg
```

## 実施内容

1. 作業前に採用元PNGと現在の反映先JPEGの存在、寸法、ファイル形式を確認する。
2. 現在のJPEGを公開ディレクトリ外の回復可能な場所へバックアップする。例：`leer-official-site/.backup/`。既存バックアップを上書きしない。
3. 採用元PNGを中央基準で厳密な16:9に整え、高品質リサンプリングで `1280×720` のJPEGへ変換する。
   - タイトル、6姿、中央の羅針盤を欠けさせない。
   - 元画像がほぼ16:9なので、必要なクロップは最小限にする。
   - JPEG品質は90〜94程度を目安にし、文字の輪郭に目立つブロックノイズを出さない。
   - 色空間はWeb表示可能なRGB/sRGBにする。
4. 変換結果を `public/assets/works/koe-no-rashinban-thumb.jpg` として配置する。
5. `public/index.html` は既に正しいファイルを参照しているため、参照が変わっていなければ編集しない。
6. `public/style.css` の `.work-thumb` は `aspect-ratio: 16 / 9`、画像は `object-fit: cover` であることを確認する。今回のためにCSSを変更しない。
7. ローカル確認を行う。
   - `npm run dev`
   - WORKS内の「声の羅針盤」カードをデスクトップ幅とモバイル幅で確認する。
   - 可能ならスクリーンショットを取得する。
8. ユーザーから明示的に依頼されていない限り、`npm run deploy` は実行しない。

## 必須QA

- [ ] WORKSカードに採用画像が表示される
- [ ] タイトルが正確に「声の羅針盤」と読める
- [ ] 四角いタイトル背景・帯・枠がない
- [ ] 6姿と中央の黄金羅針盤を判別できる
- [ ] `object-fit: cover` で重要部分が欠けない
- [ ] 画像寸法が1280×720
- [ ] JPEG変換による文字潰れ、色化け、過度な圧縮ノイズがない
- [ ] 他作品のサムネイル、HTML本文、CSS、リンクを変更していない

## 完了報告の形式

作業後、次を簡潔に報告してください。

1. 反映した採用元画像の絶対パス
2. 更新したWeb用画像の絶対パス
3. Web用画像の寸法、形式、ファイルサイズ
4. バックアップ先
5. HTML/CSSを変更したか（原則「変更なし」）
6. デスクトップ／モバイル表示確認結果
7. デプロイを実施したか（明示依頼がなければ「未実施」）
