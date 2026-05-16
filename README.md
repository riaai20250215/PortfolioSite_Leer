# Leer AI Creator Portfolio

AI creator Leer / Ria の1ページポートフォリオサイトです。Vite + React + TypeScript + Tailwind CSS で構築しています。

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Content

プロフィール、SNSリンク、ヒーローギャラリー、作品、サービス、連絡先は `src/content/siteContent.ts` に集約しています。画像やYouTube動画を差し替える場合は、このファイルを編集してください。

## Contact Form

Formspree の送信先を使う場合は `.env` を作成し、以下を設定します。

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

送信先メールは `ria.ai.20250215@gmail.com` を想定しています。Formspree 側のフォーム設定で同じ宛先になっていることを確認してください。
