import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
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
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Vibrant business colors - attractive purple/blue gradient
        restaurant: {
          50: "hsl(262, 83%, 98%)",
          100: "hsl(262, 80%, 94%)",
          200: "hsl(262, 70%, 86%)",
          300: "hsl(262, 65%, 75%)",
          400: "hsl(262, 65%, 62%)",
          500: "hsl(262, 83%, 56%)",
          600: "hsl(262, 75%, 44%)",
          700: "hsl(262, 80%, 32%)",
          800: "hsl(262, 83%, 22%)",
          900: "hsl(240, 20%, 12%)",
          950: "hsl(240, 25%, 6%)",
        },
        success: {
          50: "hsl(142, 76%, 96%)",
          100: "hsl(142, 76%, 90%)",
          200: "hsl(142, 70%, 80%)",
          300: "hsl(142, 65%, 65%)",
          400: "hsl(142, 65%, 48%)",
          500: "hsl(142, 72%, 38%)",
          600: "hsl(142, 76%, 30%)",
          700: "hsl(142, 76%, 22%)",
          800: "hsl(142, 76%, 16%)",
          900: "hsl(142, 76%, 11%)",
          950: "hsl(142, 80%, 6%)",
        },
        warning: {
          50: "hsl(48, 100%, 96%)",
          100: "hsl(48, 96%, 88%)",
          200: "hsl(45, 95%, 74%)",
          300: "hsl(40, 95%, 58%)",
          400: "hsl(36, 92%, 48%)",
          500: "hsl(32, 92%, 40%)",
          600: "hsl(26, 92%, 34%)",
          700: "hsl(22, 90%, 26%)",
          800: "hsl(18, 85%, 20%)",
          900: "hsl(15, 80%, 14%)",
          950: "hsl(15, 90%, 8%)",
        },
        // Additional vibrant colors for UI elements
        electric: {
          50: "hsl(186, 100%, 95%)",
          100: "hsl(186, 100%, 88%)",
          200: "hsl(186, 100%, 72%)",
          300: "hsl(186, 100%, 50%)",
          400: "hsl(186, 100%, 42%)",
          500: "hsl(186, 100%, 35%)",
          600: "hsl(186, 100%, 28%)",
          700: "hsl(186, 100%, 22%)",
          800: "hsl(186, 100%, 16%)",
          900: "hsl(186, 100%, 11%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Inter", "ui-sans-serif", "system-ui"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgb(168 85 247 / 0.4)" },
          "50%": { boxShadow: "0 0 30px rgb(168 85 247 / 0.8)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
        bounce: "bounce 1s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
