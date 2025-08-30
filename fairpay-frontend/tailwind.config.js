/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#2563eb"
        },
        success: {
          500: "#10b981"
        }
      }
    }
  },
  plugins: [],
};
