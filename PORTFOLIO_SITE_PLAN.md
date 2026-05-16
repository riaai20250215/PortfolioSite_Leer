# AI Creator Portfolio Site Implementation Plan

## Summary

AI creatorとしての世界観、作品、SNS、問い合わせ導線を1ページで魅力的に見せるポートフォリオサイトを新規構築する。

方向性は、`https://pinyo.jp/` のような強いビジュアルと世界観を、ブルー基調、透明感、未来感のある表現に置き換える。あわせて、`https://lit.link/` のようにプロフィール、リンク、動画、作品を差し替えやすい構成にする。

訪問者は編集できず、閲覧、動画再生、言語切替、ギャラリー操作、問い合わせのみ可能にする。運営者側は設定ファイルを更新することで、プロフィール、SNSリンク、作品、YouTube動画、表示順、公開/非公開を変更できる。

## Core Decisions

- Stack: Vite + React + TypeScript
- Styling: Tailwind CSS
- Motion: Framer Motion and CSS animation
- Icons: lucide-react
- Language switch: JA / EN
- Contact delivery: Formspree endpoint, delivered to `ria.ai.20250215@gmail.com`
- Content editing: owner-only configuration file, no public editing UI
- Hosting target: static hosting such as Vercel, Netlify, or GitHub Pages

## Site Structure

1. Hero Gallery
   - Top area with image and video cards flowing horizontally in an infinite loop.
   - Use a blue, cinematic, AI-dream visual style.
   - Include short catch copy and clear calls to action.

2. Profile
   - Introduce the creator name, role, activity concept, and AI creation theme.
   - Keep copy concise and emotionally resonant.

3. Social Links
   - Embed links to X, YouTube, Instagram, and TikTok.
   - URLs:
     - X: `https://x.com/ria_aicreator`
     - YouTube: `https://www.youtube.com/@ria_aicreator`
     - Instagram: `https://www.instagram.com/leer.ai.20260418?igsh=MzQ0NHVoZjNlOHcz&utm_source=qr`
     - TikTok: `https://www.tiktok.com/@leer.ai.20260418?_r=1&_t=ZS-96N6vRqholM`

4. Featured Works
   - Showcase selected videos, illustrations, and AI works.
   - Use large visual cards rather than a dense grid.
   - Support tags such as video, illustration, shorts, character, world, and AI visual.

5. Services / Requests
   - Briefly show what visitors can request:
     - AI illustration
     - AI short video
     - SNS visual
     - Character/world creation
     - Music video or promotional visual direction

6. Contact
   - Contact form with name, email, inquiry type, and message.
   - Send inquiries through Formspree to `ria.ai.20250215@gmail.com`.

## Content Data Model

Content should be centralized in `src/content/siteContent.ts` so future updates are easy.

```ts
type Locale = "ja" | "en";
type MediaKind = "image" | "localVideo" | "youtube";

type MediaItem = {
  id: string;
  kind: MediaKind;
  title: Record<Locale, string>;
  description?: Record<Locale, string>;
  src: string;
  thumbnail?: string;
  tags?: string[];
  visible: boolean;
  order: number;
};

type SiteContent = {
  profile: Record<Locale, {
    name: string;
    role: string;
    bio: string;
  }>;
  socialLinks: {
    label: string;
    url: string;
    kind: "x" | "youtube" | "instagram" | "tiktok";
  }[];
  heroGallery: MediaItem[];
  featuredWorks: MediaItem[];
  services: Record<Locale, string[]>;
  contact: {
    email: string;
    formEndpointEnv: "VITE_FORMSPREE_ENDPOINT";
  };
};
```

## Design Direction

- Main colors: deep navy, ice blue, cyan, white.
- Accent: subtle glow, glass-like panels, soft light reflections.
- Avoid a one-note blue-only palette by using white space, dark contrast, and small cyan highlights.
- Use generous spacing so the works feel premium and artistic.
- Avoid overusing cards inside cards.
- Keep the first screen focused on the creator's world, not a marketing-style landing page.

## Motion / Interaction

- Infinite horizontal gallery in the hero section.
- Pause gallery on hover and provide a pause control for accessibility.
- Fade-in sections as they enter the viewport.
- Add subtle floating motion to selected visual cards.
- Respect `prefers-reduced-motion` and reduce automatic movement for users who prefer less motion.
- Load YouTube embeds lazily: show thumbnails first, then load iframe only after click.

## Implementation Steps

1. Initialize the frontend project.
   - Create Vite React TypeScript app in this workspace.
   - Add Tailwind CSS, Framer Motion, and lucide-react.

2. Create the content system.
   - Add `src/content/siteContent.ts`.
   - Store profile, social links, gallery items, featured works, services, and contact settings.
   - Add JA / EN text in the same structure.

3. Build layout and theme.
   - Create global styles and theme tokens.
   - Implement responsive layout for desktop, tablet, and mobile.

4. Build components.
   - `LanguageToggle`
   - `HeroMarqueeGallery`
   - `ProfileSection`
   - `SocialLinks`
   - `FeaturedWorks`
   - `ServicesSection`
   - `ContactForm`
   - `YouTubeEmbedCard`

5. Add accessibility and performance support.
   - Keyboard-accessible buttons and links.
   - Reduced-motion styles.
   - Lazy loading for images and YouTube iframes.
   - Clear focus states.

6. Configure contact form.
   - Use `VITE_FORMSPREE_ENDPOINT`.
   - Add validation, loading state, success state, and error state.
   - Confirm delivery to `ria.ai.20250215@gmail.com` after endpoint setup.

7. Verify and polish.
   - Test on desktop and mobile widths.
   - Check gallery motion, YouTube playback, language switching, and form behavior.
   - Run build and Lighthouse checks if available.

## Test Plan

- The site builds without TypeScript errors.
- Desktop, tablet, and mobile layouts do not overlap or crop important text.
- JA / EN toggle changes all visible text.
- Social links open the correct external URLs.
- Hero gallery loops smoothly and can be paused.
- Reduced-motion mode disables or softens major animations.
- YouTube cards load iframe only after interaction.
- Contact form validates required fields.
- Contact form shows success and error states.
- Formspree delivery reaches `ria.ai.20250215@gmail.com` after endpoint configuration.

## Assumptions

- The current workspace is empty, so implementation can start from a clean Vite app.
- Initial release will not include a CMS or admin dashboard.
- Visitors cannot edit the page.
- Owner updates will be handled by editing the content configuration file and redeploying.
- If final media assets are not available during initial implementation, placeholder content will be used and kept easy to replace.

