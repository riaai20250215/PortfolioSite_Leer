import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050816",
        navy: "#08142f",
        midnight: "#0b1024",
        frost: "#eaf8ff",
        cyanGlow: "#63e6ff",
        aurora: "#8ff7d2",
        roseSignal: "#ff8fb3",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 230, 255, 0.18)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.32)",
      },
      backgroundImage: {
        "radial-light":
          "radial-gradient(circle at 20% 20%, rgba(99,230,255,0.16), transparent 34%), radial-gradient(circle at 82% 18%, rgba(143,247,210,0.12), transparent 28%), linear-gradient(135deg, #050816 0%, #08142f 52%, #10152d 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
