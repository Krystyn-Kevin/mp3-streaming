/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "var(--color-bg)",
          elevated: "var(--color-bg-elevated)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          hover: "var(--color-surface-hover)",
          glass: "var(--color-surface-glass)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          strong: "var(--color-border-strong)",
        },
        accent: {
          DEFAULT: "#3B82F6", // primary accent - blue (constant across themes)
          hover: "#5B93F7",
          muted: "rgba(59, 130, 246, 0.15)",
        },
        accent2: {
          DEFAULT: "#8B5CF6", // secondary accent - violet (constant across themes)
          muted: "rgba(139, 92, 246, 0.15)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["'Sora'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "18px",
        xl: "24px",
      },
      boxShadow: {
        panel: "0 8px 30px rgba(0, 0, 0, 0.35)",
        floating: "0 16px 48px rgba(0, 0, 0, 0.5)",
        glow: "0 0 30px rgba(59, 130, 246, 0.25)",
      },
      backdropBlur: {
        glass: "20px",
      },
      keyframes: {
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        fadeIn: {
          from: { opacity: 0, transform: "translateY(4px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        pulseBar: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "spin-slow": "spinSlow 16s linear infinite",
        "fade-in": "fadeIn 150ms ease-out",
        "pulse-bar": "pulseBar 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
