# Image Placeholders

各 SVG は実画像差し替え用の仮置きです。codex で画像生成後、**同じディレクトリに同じファイル名（拡張子は `.jpg` / `.png` / `.webp` のいずれかでも可）** で配置し、必要に応じて `src/content/siteContent.ts` の `imageUrl` のパスを更新してください。

## 共通の世界観

ブルー基調、透明感、未来感。ピンヨ的シネマティックさを目指し、暗紺・氷青・サイバーシアンを軸に、人物には静かな感情を宿す。

## ファイル一覧 / プロンプト案

### Hero

| File | Aspect | Prompt suggestion |
|---|---|---|
| `hero-portrait.svg` | 3:4 (600×800) | A cinematic AI-generated portrait of an Asian woman in profile, blue/cyan stylized hair flowing with light particles, soft glow against a deep navy background, blending technology and emotion, futuristic AI creator aesthetic, high detail, dreamy atmosphere |

### Marquee thumbnails (`marquee/`)

すべて横長 3:2 (600×400) 推奨。

| File | Prompt suggestion |
|---|---|
| `01-ice.svg` | A character wrapped in winter light, frosted hair, icy crystals, soft blue glow |
| `02-city.svg` | A blue cinematic cityscape before dawn, neon towers in cyan mist |
| `03-portrait.svg` | A close-up profile of a woman with crystalline hair, transparent emotion, soft blue tone |
| `04-tower.svg` | A futuristic spire silhouette against twilight, warm amber meeting cool blue |
| `05-film.svg` | A backlit short-film stage, silhouettes against a glowing screen |
| `06-signal.svg` | An abstract device with floating UI cards, violet to deep blue gradient |
| `07-aurora.svg` | A girl with aurora-colored eyes, green-teal light wrapping around her |
| `08-lunar.svg` | A figure walking on the moon, silver landscape with Earth glow |
| `09-dream.svg` | A dreamlike window scene, soft violet light, ethereal mood |

### Featured works (`works/`)

上段（01〜05）は縦長 3:4 (600×800)、下段（06〜08）は横長 3:2 (600×400) 推奨。

| File | Prompt suggestion |
|---|---|
| `01-blue-prayer.svg` | A still character portrait blending icy stillness with inner emotion, cold blue palette |
| `02-tokyo-nocturne.svg` | A nocturnal Tokyo cityscape, key visual for a short film, deep blue with neon reflections |
| `03-crystal-voice.svg` | A music-video direction visual of a girl with crystalline hair, light fragments swirling |
| `04-lunar-postcard.svg` | A solitary figure on a lunar shore, Earth on the horizon, quiet melancholy |
| `05-aurora-fragments.svg` | A portrait wrapped in fragments of aurora light, emerald and cobalt highlights |
| `06-silent-loop.svg` | A few-second reel composition, low-light figures inside a glowing frame |
| `07-midnight-bloom.svg` | A quiet floral scene blooming inside a navy night, gentle violet luminescence |
| `08-dream-protocol.svg` | A dreamy social-series visual for a brand collab, soft pastels over cyan |

## 差し替え手順（codex 向け）

1. 上記の prompt をもとに画像を生成
2. `public/images/<同じパス>.jpg` などとして保存
3. `src/content/siteContent.ts` の `imageUrl` の拡張子を更新（同名ファイルの場合）
4. 既存の `.svg` プレースホルダは削除して構わない
