import type { Config } from "tailwindcss"

const config = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
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

        chatbot_background: "hsl(var(--chatbot-background))",
        chatbot_foreground: "hsl(var(--chatbot-foreground))",
        chatbot_primary: {
          DEFAULT: "var(--chatbot-theme-color)",
          foreground: "var(--chatbot-text-color)",
        },
        chatbot_secondary: {
          DEFAULT: "hsl(var(--chatbot-secondary))",
          foreground: "hsl(var(--chatbot-secondary-foreground))",
        },
        chatbot_destructive: {
          DEFAULT: "hsl(var(--chatbot-destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        chatbot_muted: {
          DEFAULT: "hsl(var(--chatbot-muted))",
          foreground: "hsl(var(--chatbot-muted-foreground))",
        },
        chatbot_accent: {
          DEFAULT: "hsl(var(--chatbot-accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        chatbot_popover: {
          DEFAULT: "hsl(var(--chatbot-popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        chatbot_message: {
          DEFAULT: "hsl(var(--chatbot-message-bg))",
          foreground: "hsl(var(--chatbot-message-text))",
        }, 
      },
      borderRadius: {
        lg: "var(--chatbot-radius)",
        md: "calc(var(--chatbot-radius) - 2px)",
        sm: "calc(var(--chatbot-radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config