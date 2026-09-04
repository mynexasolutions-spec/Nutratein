/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-brand, #c8102e)",
          dark: "var(--color-brand-dark, #9c0c23)",
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#c8102e",
          600: "#b00d28",
          700: "#9c0c23",
          800: "#800a1c",
          900: "#650817",
        },
        ink: {
          DEFAULT: "var(--color-ink, #16181b)",
          soft: "var(--color-ink-soft, #4b4f54)",
          light: "#71767d",
        },
        paper: "var(--color-paper, #ffffff)",
        surface: "var(--color-surface, #f7f7f8)",
        border: "var(--color-border, #e7e7e9)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Montserrat", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
        devanagari: ["var(--font-devanagari)", "Noto Sans Devanagari", "serif"],
        body: ["var(--font-body)", "var(--font-sans)", "Montserrat", "sans-serif"],
        heading: ["var(--font-display)", "var(--font-serif)", "Playfair Display", "serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm, 6px)",
        md: "var(--radius-md, 10px)",
        lg: "var(--radius-lg, 18px)",
      },
    },
  },
  plugins: [],
};
