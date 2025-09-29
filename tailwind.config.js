/** @type {import('tailwindcss').Config} */
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003366",   // Azul fuerte del logo
        accent: "#FFD700",    // Amarillo vibrante
        success: "#006400",   // Verde oscuro (tickets)
        light: "#F9FAFB",     // Fondo gris claro
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
