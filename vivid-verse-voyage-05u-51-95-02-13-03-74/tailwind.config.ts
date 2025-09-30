import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        "border-light": "hsl(var(--border-light))",
        input: "hsl(var(--input))",
        "input-border": "hsl(var(--input-border))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
          elevated: "hsl(var(--background-elevated))",
          secondary: "hsl(var(--background-secondary))",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          hover: "hsl(var(--secondary-hover))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          shadow: "hsl(var(--card-shadow))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: {
            DEFAULT: "hsl(var(--sidebar-primary))",
            foreground: "hsl(var(--sidebar-primary-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--sidebar-accent))",
            foreground: "hsl(var(--sidebar-accent-foreground))",
          },
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // AliExpress inspired color system
        ali: {
          primary: "hsl(var(--ali-primary))",
          secondary: "hsl(var(--ali-secondary))", 
          "orange-light": "hsl(var(--ali-orange-light))",
          "red-light": "hsl(var(--ali-red-light))",
          neutral: "hsl(var(--ali-neutral))",
          border: "hsl(var(--ali-border))",
          "text-primary": "hsl(var(--ali-text-primary))",
          "text-secondary": "hsl(var(--ali-text-secondary))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        DEFAULT: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
        xs: "6px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
      },
      boxShadow: {
        "native": "0 1px 3px 0 hsl(var(--card-shadow) / 0.1), 0 1px 2px 0 hsl(var(--card-shadow) / 0.06)",
        "native-md": "0 4px 6px -1px hsl(var(--card-shadow) / 0.1), 0 2px 4px -1px hsl(var(--card-shadow) / 0.06)",
        "native-lg": "0 10px 15px -3px hsl(var(--card-shadow) / 0.1), 0 4px 6px -2px hsl(var(--card-shadow) / 0.05)",
        "native-xl": "0 20px 25px -5px hsl(var(--card-shadow) / 0.1), 0 10px 10px -5px hsl(var(--card-shadow) / 0.04)",
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
          ...fontFamily.sans
        ],
        aliexpress: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        ping: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(-5%)", animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)" },
          "50%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shake: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-3px)" },
          "50%": { transform: "translateX(3px)" },
          "75%": { transform: "translateX(-3px)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        shake: "shake 0.4s ease-in-out",
        fadeIn: "fadeIn 0.5s ease-in-out",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
