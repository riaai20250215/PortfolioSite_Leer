# Work Log

このプロジェクトでの作業履歴。新しい作業ごとに日付付きエントリを上に積み重ねる。

---

## 2026-05-22 — デザインモック準拠への UI 全面改修 (Claude Code)

### 背景

初版 (`a76d7b9 Create Leer RIA portfolio site`) では、ヒーロー画像・マーキー・Featured Works のビジュアルが **CSS で手描きした抽象アート** (`portrait` / `ice` / `city` / `crystal` / `astronaut` / `film` / `signal` / `dream` の 8 バリアント) として実装されており、ユーザーが codex 側で生成していた AI ビジュアルのデザインモックとは別物になっていた。

ユーザーから「添付デザインのような UI に近づけてほしい。画像は後で codex に生成依頼するので、一旦プレースホルダで OK」との指示を受け、画像ベースのレイアウトに再構築した。

### 主な差分

| 箇所 | 改修前 | 改修後 |
|---|---|---|
| ビジュアル | `VisualArt` で 8 種の CSS 抽象アート | `<img>` ベースの `<MediaImage>` |
| 画像ソース | なし (`#generated-xxx` 仮文字列) | `/images/...svg` の SVG プレースホルダ |
| body 背景 | 横方向に水色ストライプの 5-stop グラデ | 暗紺ベース + `ambient-glow` の 4 点 radial |
| Hero | 3 カラムだがアートが小さい | 中央ポートレートを主役にした 3 カラム |
| Featured Works | 4 カラム × span ベース 6 件 | 5 カラム × 2 行（下段は右 3 列のみ）8 件 |
| Marquee | 6 件 (CSS アート) | 9 件 (画像) |
| Contact | Name/Email/Company/InquiryType/Message | Name/Email/Company/Message |
| Services | 4 カテゴリ (Character/World 含む) | デザイン準拠 4 カテゴリ (Brand Collaboration) |

### 追加ファイル

- `public/images/hero-portrait.svg`
- `public/images/marquee/{01-09}.svg` — 9 種のマーキーサムネ
- `public/images/works/{01-08}.svg` — 8 種の作品ビジュアル
- `public/images/README.md` — 各画像の生成プロンプト案と差し替え手順 (codex 引き継ぎ用)
- `WORK_LOG.md` (本ファイル)

各 SVG は `radialGradient` ベースのプレースホルダで、作品名 + `PLACEHOLDER` ラベルを中央配置。codex が同名で `.jpg`/`.png`/`.webp` に差し替えれば即反映される構造。

### 変更ファイル

- `src/content/siteContent.ts` — `MediaItem.imageUrl` 追加、`heroPortrait` 追加、作品 8 件 / マーキー 9 件に拡張、`inquiryOptions` 削除、サービスを 4 種に整理
- `src/App.tsx` — `VisualArt` 撤去、`<MediaImage>` 導入、Hero/Featured Works/Contact レイアウト再構成、Inquiry type 削除
- `src/index.css` — 約 700 行の `visual-*` 抽象アート CSS 削除、body 背景刷新、Hero/Works/Contact のグリッド再設計、`ambient-glow` 追加
- `.gitignore` — `.playwright-mcp/` を追加

### 削除ファイル

App.tsx および main.tsx から参照されておらず、削除済みの `inquiryOptions` 等を import していて `tsc` を失敗させる原因になっていた旧コンポーネント群を削除。

- `src/components/{ContactForm,FeaturedWorks,HeroMarqueeGallery,LanguageToggle,NavBar,ProfileSection,SectionReveal,ServicesSection,SocialLinks,YouTubeEmbedCard}.tsx`
- `src/lib/media.ts`

### 検証

- `npm run build` ✓ (TypeScript + Vite)
- Playwright で desktop (1440×1024) / mobile (390×844) / EN-JA トグルを動作確認
- コンソールエラーは favicon 404 のみ

### codex への引き継ぎ

`public/images/README.md` 参照。各 SVG ファイルに対応する生成プロンプト案・推奨アスペクト比をまとめてある。差し替えは:

1. プロンプトで画像生成
2. `public/images/<同じパス>.jpg` 等として保存
3. (拡張子を変更する場合のみ) `src/content/siteContent.ts` の `imageUrl` を更新
4. 旧 `.svg` を削除
