import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--chatbot-border))",
        input: "hsl(var(--chatbot-input))",
        ring: "hsl(var(--chatbot-ring))",
        background: "hsl(var(--chatbot-background))",
        foreground: "hsl(var(--chatbot-foreground))",
        primary: {
          DEFAULT: "hsl(var(--chatbot-primary))",
          foreground: "hsl(var(--chatbot-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--chatbot-secondary))",
          foreground: "hsl(var(--chatbot-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--chatbot-destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--chatbot-muted))",
          foreground: "hsl(var(--chatbot-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--chatbot-accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--chatbot-popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--chatbot-card))",
          foreground: "hsl(var(--card-foreground))",
        },
        bg: "var(--chatbot-theme-color)",
        text: "var(--chatbot-text-color)",
      },
      borderRadius: {
        lg: "var(--chatbot-radius)",
        md: "calc(var(--chatbot-radius) - 2px)",
        sm: "calc(var(--chatbot-radius) - 4px)",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config