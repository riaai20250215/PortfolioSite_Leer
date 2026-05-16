export type Locale = "ja" | "en";
export type MediaKind = "image" | "localVideo" | "youtube";
export type VisualVariant =
  | "portrait"
  | "ice"
  | "city"
  | "crystal"
  | "astronaut"
  | "film"
  | "signal"
  | "dream";

export type LocalizedText = Record<Locale, string>;

export type MediaItem = {
  id: string;
  kind: MediaKind;
  title: LocalizedText;
  description?: LocalizedText;
  src: string;
  thumbnail?: string;
  tags?: string[];
  visible: boolean;
  order: number;
  visual?: VisualVariant;
  motion?: boolean;
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
      role: "AI Creator",
      bio: "AIを創作のパートナーに、静かな物語性を持つビジュアルとショートムービーを制作しています。",
      concept:
        "透明感のある青、未来的な都市、感情を宿したキャラクター。見る人の想像が少し先へ進むような世界を形にします。",
      location: "Tokyo, Japan",
      availability: "制作・コラボ相談受付中",
    },
    en: {
      name: "Leer / RIA",
      role: "AI Creator",
      bio: "I create AI visuals and short stories with artificial intelligence as my creative partner.",
      concept:
        "Cool blue light, cinematic cities, and characters with quiet emotion. Each piece is built to move imagination forward.",
      location: "Tokyo, Japan",
      availability: "Available for projects",
    },
  },
  socialLinks: [
    {
      label: "X",
      note: { ja: "最新情報", en: "Follow me" },
      url: "https://x.com/ria_aicreator",
      kind: "x",
    },
    {
      label: "YouTube",
      note: { ja: "映像作品", en: "Watch reels" },
      url: "https://www.youtube.com/@ria_aicreator",
      kind: "youtube",
    },
    {
      label: "Instagram",
      note: { ja: "日々のビジュアル", en: "Daily visuals" },
      url: "https://www.instagram.com/leer.ai.20260418?igsh=MzQ0NHVoZjNlOHcz&utm_source=qr",
      kind: "instagram",
    },
    {
      label: "TikTok",
      note: { ja: "ショートと制作過程", en: "Shorts and process" },
      url: "https://www.tiktok.com/@leer.ai.20260418?_r=1&_t=ZS-96N6vRqholM",
      kind: "tiktok",
    },
  ],
  heroGallery: [
    {
      id: "ice-memory",
      kind: "image",
      title: { ja: "氷の記憶", en: "Ice Memory" },
      description: {
        ja: "雪光をまとったキャラクタービジュアル。",
        en: "A character visual wrapped in winter light.",
      },
      src: "#generated-ice-memory",
      tags: ["character", "ai visual"],
      visible: true,
      order: 1,
      visual: "ice",
    },
    {
      id: "night-archive",
      kind: "image",
      title: { ja: "夜明け前の都市", en: "City Before Dawn" },
      description: {
        ja: "青い霧と高層都市の世界観。",
        en: "A blue city world built from light and haze.",
      },
      src: "#generated-night-archive",
      tags: ["world", "cinematic"],
      visible: true,
      order: 2,
      visual: "city",
      motion: true,
    },
    {
      id: "crystal-girl",
      kind: "image",
      title: { ja: "水晶の横顔", en: "Crystal Profile" },
      description: {
        ja: "透明な感情を残すポートレート。",
        en: "A portrait that leaves a transparent afterglow.",
      },
      src: "#generated-crystal-girl",
      tags: ["portrait", "illustration"],
      visible: true,
      order: 3,
      visual: "portrait",
    },
    {
      id: "lunar-short",
      kind: "image",
      title: { ja: "月面ショート", en: "Lunar Short" },
      description: {
        ja: "静かな宇宙を歩くショート映像の構想。",
        en: "A short film concept walking through quiet space.",
      },
      src: "#generated-lunar-short",
      tags: ["short film", "story"],
      visible: true,
      order: 4,
      visual: "astronaut",
      motion: true,
    },
    {
      id: "afterimage",
      kind: "image",
      title: { ja: "残像のリール", en: "Afterimage Reel" },
      description: {
        ja: "SNSで止まりたくなる数秒の構成。",
        en: "A few seconds composed for a social pause.",
      },
      src: "#generated-afterimage",
      tags: ["reel", "motion"],
      visible: true,
      order: 5,
      visual: "film",
      motion: true,
    },
    {
      id: "blue-signal",
      kind: "image",
      title: { ja: "青い信号", en: "Blue Signal" },
      description: {
        ja: "ブランドの印象を作るSNSビジュアル。",
        en: "Social visuals that build a coherent signal.",
      },
      src: "#generated-blue-signal",
      tags: ["sns", "brand"],
      visible: true,
      order: 6,
      visual: "signal",
    },
  ],
  featuredWorks: [
    {
      id: "work-blue-prayer",
      kind: "image",
      title: { ja: "Blue Prayer", en: "Blue Prayer" },
      description: {
        ja: "氷のような静けさとキャラクターの内面を重ねたAIビジュアル。",
        en: "An AI visual blending icy stillness with a character's inner world.",
      },
      src: "#generated-work-blue-prayer",
      tags: ["illustration", "character"],
      visible: true,
      order: 1,
      visual: "ice",
    },
    {
      id: "work-tokyo-nocturne",
      kind: "image",
      title: { ja: "Tokyo Nocturne", en: "Tokyo Nocturne" },
      description: {
        ja: "夜の都市を舞台にしたショート映像向けのキービジュアル。",
        en: "A key visual for a short film set in a nocturnal city.",
      },
      src: "#generated-work-tokyo-nocturne",
      tags: ["short film", "world"],
      visible: true,
      order: 2,
      visual: "city",
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
      src: "#generated-work-crystal-voice",
      tags: ["mv", "visual direction"],
      visible: true,
      order: 3,
      visual: "crystal",
    },
    {
      id: "work-lunar-postcard",
      kind: "image",
      title: { ja: "Lunar Postcard", en: "Lunar Postcard" },
      description: {
        ja: "孤独と余白をテーマにした物語のワンシーン。",
        en: "A story frame built around solitude and space.",
      },
      src: "#generated-work-lunar-postcard",
      tags: ["story", "concept"],
      visible: true,
      order: 4,
      visual: "astronaut",
    },
    {
      id: "work-silent-loop",
      kind: "image",
      title: { ja: "Silent Loop", en: "Silent Loop" },
      description: {
        ja: "数秒で世界観を見せるためのリール構成。",
        en: "A reel composition designed to reveal a world in seconds.",
      },
      src: "#generated-work-silent-loop",
      tags: ["reel", "motion"],
      visible: true,
      order: 5,
      visual: "film",
      motion: true,
    },
    {
      id: "work-dream-protocol",
      kind: "image",
      title: { ja: "Dream Protocol", en: "Dream Protocol" },
      description: {
        ja: "ブランドコラボ向けの幻想的なSNSシリーズ。",
        en: "A dreamy social series for brand collaboration.",
      },
      src: "#generated-work-dream-protocol",
      tags: ["sns", "campaign"],
      visible: true,
      order: 6,
      visual: "dream",
    },
  ],
  services: {
    ja: [
      "AI Illustration",
      "AI Short Film",
      "SNS Visuals",
      "Character / World",
    ],
    en: [
      "AI Illustration",
      "AI Short Film",
      "SNS Visuals",
      "Character / World",
    ],
  },
  serviceDetails: {
    ja: [
      "SNS投稿、アイコン、キービジュアル向けの高品質なAIイラスト。",
      "数秒から世界観を伝えるショート動画の構成とビジュアル制作。",
      "投稿、告知、リール表紙まで統一感のあるSNSクリエイティブ。",
      "キャラクター、背景、世界設定をまとめて設計するビジュアル制作。",
    ],
    en: [
      "High-quality AI visuals for posts, icons, and key art.",
      "Short-form cinematic stories generated with AI.",
      "Eye-catching content for social media and daily updates.",
      "Characters, environments, and story worlds designed together.",
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
    worksLead: "生成したビジュアルと映像構想を、作品として並べました。",
    requestsTitle: "SERVICES",
    requestsLead: "What I Can Create For You",
    contactTitle: "Business Inquiries",
    contactLead: "制作依頼、コラボレーション、相談はこちらから。",
    contactKicker: "LET'S CREATE TOGETHER",
    name: "Name",
    email: "Email",
    company: "Company / Organization",
    inquiryType: "Inquiry type",
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
    viewAll: "VIEW ALL",
    learnMore: "LEARN MORE",
    footer: "AI visuals, short films, characters, and quiet future worlds.",
  },
  en: {
    navProfile: "ABOUT",
    navWorks: "WORKS",
    navRequests: "SERVICES",
    navContact: "CONTACT",
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
    contactLead: "For commissions, collaborations, and visual direction.",
    contactKicker: "LET'S CREATE TOGETHER",
    name: "Name",
    email: "Email",
    company: "Company / Organization",
    inquiryType: "Inquiry type",
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
    viewAll: "VIEW ALL",
    learnMore: "LEARN MORE",
    footer: "AI visuals, short films, characters, and quiet future worlds.",
  },
} satisfies Record<Locale, Record<string, string>>;

export const inquiryOptions = {
  ja: ["AIイラスト", "AIショート映像", "SNSビジュアル", "キャラクター / 世界観", "コラボ相談", "その他"],
  en: [
    "AI illustration",
    "AI short film",
    "Social visual",
    "Character / world",
    "Collaboration",
    "Other",
  ],
} satisfies Record<Locale, string[]>;
