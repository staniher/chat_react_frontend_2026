/** @type {import('tailwindcss').Config} */
export default {
  // Chemins vers tous les fichiers de composants pour que Tailwind puisse purger le CSS inutilisé
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
