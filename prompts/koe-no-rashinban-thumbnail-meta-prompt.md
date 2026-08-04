# メタCGプロンプト v2 — 「声の羅針盤」公式サイト用サムネイル(Codex用)

> 公式サイト WORKS カード用サムネイルを Codex に生成させるためのメタプロンプト。
> v1(単独の女性像+光の羅針盤、Renoise nano-banana-2 で生成)は現行サムネとして掲載中。
> v2 は主人公・ヒロイン各3形態(リアル/配信/イベント)を登場させる改訂版。
> 生成後の掲載作業(JPEG変換・配置・デプロイ)は Claude 側で行う。

---

````text
# タスク
アニメティザー「声の羅針盤」(PocketANIME World Competition 出品作) の
公式サイト掲載用サムネイル画像を 1 枚、新規生成して保存してください。
主人公とヒロインの「リアル姿 / 配信時の姿 / イベント時の姿」計 6 つの姿を
1 枚に登場させます。

# 入力ファイル(キャラクター参照画像 — 生成前に必ず目視で選定)
リポジトリ: `20250331_PocketANIME World Competition/`

| 姿 | 参照フォルダ |
|---|---|
| 主人公・リアル | `画像/主人公リアル/` |
| 主人公・配信時 | `画像/主人公配信姿/メインヴィジュアル/` |
| 主人公・イベント時 | `画像/主人公配信姿/ベストカップル杯/` |
| ヒロイン・リアル | `画像/ヒロインリアル/` |
| ヒロイン・配信時 | `画像/ヒロイン配信姿/メインヴィジュアル/` |
| ヒロイン・イベント時 | `画像/ヒロイン配信姿/ベストカップル杯/` |

- 各フォルダから、キャラクターデザインが最も確定的に分かる 1 枚を選び、
  計 6 枚を画像生成 API への参照画像として毎回添付する
- `没/` フォルダ内の画像は使用しない
- `画像/ライバル/` のキャラクターは登場させない — 最重要
- 参照画像から各姿の髪型・髪色・瞳・衣装・小物を正確に抽出し、
  下記プロンプトの [MC-*] / [HR-*] プレースホルダを具体的な英語描写で
  置き換えてから生成すること(想像で補完しない。参照画像が正)

# 画像生成プロンプト(プレースホルダ置換後、逐語で API に渡す)
Cinematic anime illustration, theatrical anime film quality, painterly finish,
16:9 landscape.
Concept: "a voice becomes a compass that guides someone" — the two leads of a
streaming/singing drama shown in all three of their identities.

CENTER (largest, main focus): the two leads in their REAL-LIFE forms,
[MC-real] and [HR-real], standing back to back at dusk in a warm room,
each singing into a studio condenser microphone, eyes gently closed.
From their microphones a luminous golden stream of voice flows outward,
sweeping across the frame and forming a large glowing compass rose behind
them at the center of the composition.

LEFT SIDE (medium, secondary): their STREAMING forms, [MC-stream] and
[HR-stream], appearing inside a floating holographic screen panel made of
soft cyan-gold light, waving cheerfully toward the viewer as if mid-broadcast.

RIGHT SIDE (medium, secondary): their EVENT forms, [MC-event] and
[HR-event], appearing inside a second floating light panel, standing side by
side on a small glittering stage with confetti light particles.

The golden voice-stream connects all three groups in one continuous S-curve,
sparkling particles and drifting dust motes throughout.
Warm color palette: amber gold, soft cream white, deep teal shadows,
accents of cyan in the holographic panels.
Emotional, hopeful, slightly nostalgic atmosphere.
All six figures must keep their exact designs from the attached reference
images (hair, eyes, outfits, accessories). Same two people across the three
forms — faces must read as identical persons.
Clean silhouettes, readable even at 320x180 thumbnail size.
NO READABLE TEXT anywhere in the image. No watermarks, no logos.
Not 3D render style, not photorealistic, not cheap web-ad style.

# 生成設定
- サイズ: 16:9 横長(1792x1024 以上) / quality: high
- 参照画像: 上記 6 枚を毎回添付

# 生成後チェック(目視)
- 6 つの姿すべてが登場し、参照画像とデザインが一致しているか(髪色・衣装・小物)
- 主人公とヒロインが「同一人物の別の姿」として顔が通っているか
- ライバルキャラが混入していないか — 最重要
- 画面内に判読可能な文字が無いか(あれば再生成)
- 320x180 に縮小しても中央のリアル姿 2 人と光の羅針盤が判別できるか
- 温かい金色主体のトーンか(クールブルー主体は禁止)
違反があれば該当箇所を強調して再生成(最大 2 回)。

# 厳守
- 固有アーティスト名・既存作品名はプロンプトに追加・補完しない
- 参照画像は読むだけ。上書き・移動・改名は禁止
- `没/` 配下は参照しない

# 出力先
`20250331_PocketANIME World Competition/画像/サムネイル/koe_no_rashinban_site_thumb.png`
(`画像/サムネイル/` フォルダが無ければ新規作成)

# 完了報告
- 生成画像の絶対パス
- 使用した参照画像 6 枚のパス
- 品質チェック 6 項目の結果(✅/⚠️/❌)
- 再生成が発生した場合はその理由
````

---

## 生成後の掲載手順(Claude側の作業メモ)

1. `画像/サムネイル/koe_no_rashinban_site_thumb.png` を横1280px・JPEG(品質85)に変換
2. `leer-official-site/public/assets/works/koe-no-rashinban-thumb.jpg` を上書き
3. `npx wrangler deploy` で本番反映(HTMLの変更は不要 — 同名ファイル差し替えのため)
