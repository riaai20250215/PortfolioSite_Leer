export type Locale = "ja" | "en";
export type MediaKind = "image" | "video" | "youtube";

export type LocalizedText = Record<Locale, string>;

export type MediaItem = {
  id: string;
  kind: MediaKind;
  title: LocalizedText;
  description?: LocalizedText;
  imageUrl: string;
  videoUrl?: string;
  tags?: string[];
  visible: boolean;
  order: number;
  motion?: boolean;
};

export type HeroVisual = {
  imageUrl: string;
  alt: LocalizedText;
};

export type SiteContent = {
  profile: Record<
    Locale,
    {
      name: string;
      role: string;
      bio: string;
      concept: string;
      location: string;
      availability: string;
    }
  >;
  heroPortrait: HeroVisual;
  socialLinks: {
    label: string;
    note: LocalizedText;
    url: string;
    kind: "x" | "youtube" | "instagram" | "tiktok";
  }[];
  heroGallery: MediaItem[];
  featuredWorks: MediaItem[];
  services: Record<Locale, string[]>;
  serviceDetails: Record<Locale, string[]>;
  contact: {
    email: string;
    formEndpointEnv: "VITE_FORMSPREE_ENDPOINT";
  };
};

export const siteContent: SiteContent = {
  profile: {
    ja: {
      name: "Leer / RIA",
      role: "AI CREATOR",
      bio: "AIを創作のパートナーに、画像とストーリーを制作しています。テクノロジーと感情を融合させ、新しい世界をかたちにします。",
      concept:
        "透明感のある青、未来的な都市、感情を宿したキャラクター。見る人の想像を一歩先へ進める世界をつくります。",
      location: "Tokyo, Japan",
      availability: "制作・コラボ相談受付中",
    },
    en: {
      name: "Leer / RIA",
      role: "AI CREATOR",
      bio: "I create images and stories with AI as my creative partner. Blending technology and emotion to shape new worlds.",
      concept:
        "Cool blue light, cinematic cities, and characters with quiet emotion. Each piece is built to move imagination forward.",
      location: "Tokyo, Japan",
      availability: "Available for projects",
    },
  },
  heroPortrait: {
    imageUrl: "/images/hero-portrait.svg",
    alt: {
      ja: "Leer / RIA のヒーロービジュアル",
      en: "Leer / RIA hero visual",
    },
  },
  socialLinks: [
    {
      label: "X",
      note: { ja: "Follow me", en: "Follow me" },
      url: "https://x.com/ria_aicreator",
      kind: "x",
    },
    {
      label: "YouTube",
      note: { ja: "Watch reels", en: "Watch reels" },
      url: "https://www.youtube.com/@ria_aicreator",
      kind: "youtube",
    },
    {
      label: "Instagram",
      note: { ja: "Daily visuals", en: "Daily visuals" },
      url: "https://www.instagram.com/leer.ai.20260418?igsh=MzQ0NHVoZjNlOHcz&utm_source=qr",
      kind: "instagram",
    },
    {
      label: "TikTok",
      note: {
        ja: "Shorts & behind the scenes",
        en: "Shorts & behind the scenes",
      },
      url: "https://www.tiktok.com/@leer.ai.20260418?_r=1&_t=ZS-96N6vRqholM",
      kind: "tiktok",
    },
  ],
  heroGallery: [
    {
      id: "marquee-ice-memory",
      kind: "image",
      title: { ja: "氷の記憶", en: "Ice Memory" },
      imageUrl: "/images/marquee/01-ice.svg",
      tags: ["character"],
      visible: true,
      order: 1,
    },
    {
      id: "marquee-night-archive",
      kind: "image",
      title: { ja: "夜明け前の都市", en: "City Before Dawn" },
      imageUrl: "/images/marquee/02-city.svg",
      tags: ["world"],
      visible: true,
      order: 2,
      motion: true,
    },
    {
      id: "marquee-crystal-girl",
      kind: "image",
      title: { ja: "水晶の横顔", en: "Crystal Profile" },
      imageUrl: "/images/marquee/03-portrait.svg",
      tags: ["portrait"],
      visible: true,
      order: 3,
    },
    {
      id: "marquee-tower-twilight",
      kind: "image",
      title: { ja: "残響の塔", en: "Tower Twilight" },
      imageUrl: "/images/marquee/04-tower.svg",
      tags: ["world"],
      visible: true,
      order: 4,
    },
    {
      id: "marquee-afterimage",
      kind: "image",
      title: { ja: "残像のリール", en: "Afterimage" },
      imageUrl: "/images/marquee/05-film.svg",
      tags: ["motion"],
      visible: true,
      order: 5,
      motion: true,
    },
    {
      id: "marquee-blue-signal",
      kind: "image",
      title: { ja: "青い信号", en: "Blue Signal" },
      imageUrl: "/images/marquee/06-signal.svg",
      tags: ["sns"],
      visible: true,
      order: 6,
    },
    {
      id: "marquee-aurora-eye",
      kind: "image",
      title: { ja: "オーロラの瞳", en: "Aurora Eye" },
      imageUrl: "/images/marquee/07-aurora.svg",
      tags: ["portrait"],
      visible: true,
      order: 7,
    },
    {
      id: "marquee-lunar-walk",
      kind: "image",
      title: { ja: "月を歩く", en: "Lunar Walk" },
      imageUrl: "/images/marquee/08-lunar.svg",
      tags: ["story"],
      visible: true,
      order: 8,
      motion: true,
    },
    {
      id: "marquee-dream-protocol",
      kind: "image",
      title: { ja: "夢の手紙", en: "Dream Protocol" },
      imageUrl: "/images/marquee/09-dream.svg",
      tags: ["concept"],
      visible: true,
      order: 9,
    },
  ],
  featuredWorks: [
    {
      id: "work-blue-prayer",
      kind: "image",
      title: { ja: "Blue Prayer", en: "Blue Prayer" },
      description: {
        ja: "氷のような静けさと内面を重ねたキャラクタービジュアル。",
        en: "An AI visual blending icy stillness with a character's inner world.",
      },
      imageUrl: "/images/works/01-blue-prayer.svg",
      tags: ["illustration", "character"],
      visible: true,
      order: 1,
    },
    {
      id: "work-tokyo-nocturne",
      kind: "image",
      title: { ja: "Tokyo Nocturne", en: "Tokyo Nocturne" },
      description: {
        ja: "夜の都市を舞台にしたショート映像のキービジュアル。",
        en: "A key visual for a short film set in a nocturnal city.",
      },
      imageUrl: "/images/works/02-tokyo-nocturne.svg",
      tags: ["short film", "world"],
      visible: true,
      order: 2,
      motion: true,
    },
    {
      id: "work-crystal-voice",
      kind: "image",
      title: { ja: "Crystal Voice", en: "Crystal Voice" },
      description: {
        ja: "透明な歌声をイメージしたMVビジュアルディレクション。",
        en: "Music-video visual direction inspired by a transparent voice.",
      },
      imageUrl: "/images/works/03-crystal-voice.svg",
      tags: ["mv", "direction"],
      visible: true,
      order: 3,
      motion: true,
    },
    {
      id: "work-lunar-postcard",
      kind: "image",
      title: { ja: "Lunar Postcard", en: "Lunar Postcard" },
      description: {
        ja: "孤独と余白をテーマにした物語のワンシーン。",
        en: "A story frame built around solitude and space.",
      },
      imageUrl: "/images/works/04-lunar-postcard.svg",
      tags: ["story", "concept"],
      visible: true,
      order: 4,
    },
    {
      id: "work-aurora-fragments",
      kind: "image",
      title: { ja: "Aurora Fragments", en: "Aurora Fragments" },
      description: {
        ja: "ポートレートの細部に光をまとわせた一枚。",
        en: "A portrait wrapped in fragments of aurora light.",
      },
      imageUrl: "/images/works/05-aurora-fragments.svg",
      tags: ["portrait", "illustration"],
      visible: true,
      order: 5,
    },
    {
      id: "work-silent-loop",
      kind: "image",
      title: { ja: "Silent Loop", en: "Silent Loop" },
      description: {
        ja: "数秒で世界観を見せるリール構成。",
        en: "A reel composition that reveals a world in seconds.",
      },
      imageUrl: "/images/works/06-silent-loop.svg",
      tags: ["reel", "motion"],
      visible: true,
      order: 6,
      motion: true,
    },
    {
      id: "work-midnight-bloom",
      kind: "image",
      title: { ja: "Midnight Bloom", en: "Midnight Bloom" },
      description: {
        ja: "夜の中で咲くような淡い物語シーン。",
        en: "A quiet scene blooming inside the night.",
      },
      imageUrl: "/images/works/07-midnight-bloom.svg",
      tags: ["concept", "world"],
      visible: true,
      order: 7,
    },
    {
      id: "work-dream-protocol",
      kind: "image",
      title: { ja: "Dream Protocol", en: "Dream Protocol" },
      description: {
        ja: "ブランドコラボ向けの幻想的なSNSシリーズ。",
        en: "A dreamy social series for brand collaboration.",
      },
      imageUrl: "/images/works/08-dream-protocol.svg",
      tags: ["sns", "campaign"],
      visible: true,
      order: 8,
    },
  ],
  services: {
    ja: ["AI Illustration", "AI Short Film", "SNS Visuals", "Brand Collaboration"],
    en: ["AI Illustration", "AI Short Film", "SNS Visuals", "Brand Collaboration"],
  },
  serviceDetails: {
    ja: [
      "AIで生成する高品質なビジュアル。",
      "AIで生み出すシネマティックな短編。",
      "SNSで目を引くコンテンツ。",
      "ブランドと共に創るクリエイティブキャンペーン。",
    ],
    en: [
      "High-quality visuals created with AI.",
      "Cinematic stories generated by AI.",
      "Eye-catching content for social media.",
      "Creative campaigns together with brands.",
    ],
  },
  contact: {
    email: "ria.ai.20250215@gmail.com",
    formEndpointEnv: "VITE_FORMSPREE_ENDPOINT",
  },
};

export const copy = {
  ja: {
    navProfile: "ABOUT",
    navWorks: "WORKS",
    navRequests: "SERVICES",
    navContact: "CONTACT",
    navLinks: "LINKS",
    heroKicker: "AI Creator Portfolio",
    heroTitle: "AI Creator & Visual Storyteller",
    heroLead: "知性と想像力で、明日のビジュアルと物語をつくる。",
    heroPrimary: "VIEW WORKS",
    heroSecondary: "CONTACT",
    pause: "PAUSE",
    play: "PLAY",
    profileTitle: "Leer / RIA",
    profileCaption: "AI CREATOR",
    socialsTitle: "LINKS",
    socialsLead: "作品、制作過程、ショート映像はこちらから。",
    worksTitle: "FEATURED WORKS",
    worksLead: "生成したビジュアルと映像構想を作品として並べました。",
    requestsTitle: "SERVICES",
    requestsLead: "What I Can Create For You",
    contactTitle: "Business Inquiries",
    contactLead:
      "制作依頼、コラボレーション、相談はこちらから。あなたのアイデアを形にしましょう。",
    contactKicker: "LET'S CREATE TOGETHER",
    name: "Name",
    email: "Email",
    company: "Company / Organization",
    message: "Message",
    submit: "SEND MESSAGE",
    sending: "SENDING",
    success: "送信しました。内容を確認して折り返します。",
    endpointMissing:
      "送信先が未設定です。.env に VITE_FORMSPREE_ENDPOINT を追加してください。",
    error: "送信できませんでした。時間をおいて再度お試しください。",
    required: "必須項目を入力してください。",
    openExternal: "外部リンクを開く",
    playVideo: "映像を見る",
    openChannel: "チャンネルを開く",
    viewAll: "VIEW ALL WORKS",
    learnMore: "LEARN MORE",
    footer: "All rights reserved.",
  },
  en: {
    navProfile: "ABOUT",
    navWorks: "WORKS",
    navRequests: "SERVICES",
    navContact: "CONTACT",
    navLinks: "LINKS",
    heroKicker: "AI Creator Portfolio",
    heroTitle: "AI Creator & Visual Storyteller",
    heroLead: "Crafting tomorrow's visuals with intelligence and imagination.",
    heroPrimary: "VIEW WORKS",
    heroSecondary: "CONTACT",
    pause: "PAUSE",
    play: "PLAY",
    profileTitle: "Leer / RIA",
    profileCaption: "AI CREATOR",
    socialsTitle: "LINKS",
    socialsLead: "Works, process notes, and short videos live here.",
    worksTitle: "FEATURED WORKS",
    worksLead: "Generated visuals and film concepts arranged as selected works.",
    requestsTitle: "SERVICES",
    requestsLead: "What I Can Create For You",
    contactTitle: "Business Inquiries",
    contactLead:
      "I'm open to creative collaborations and commissioned work. Let's bring your ideas to life.",
    contactKicker: "LET'S CREATE TOGETHER",
    name: "Name",
    email: "Email",
    company: "Company / Organization",
    message: "Message",
    submit: "SEND MESSAGE",
    sending: "SENDING",
    success: "Sent. I will review your message and get back to you.",
    endpointMissing:
      "Form endpoint is not configured. Add VITE_FORMSPREE_ENDPOINT to .env.",
    error: "Could not send the message. Please try again later.",
    required: "Please fill out the required fields.",
    openExternal: "Open external link",
    playVideo: "Play video",
    openChannel: "Open channel",
    viewAll: "VIEW ALL WORKS",
    learnMore: "LEARN MORE",
    footer: "All rights reserved.",
  },
} satisfies Record<Locale, Record<string, string>>;
