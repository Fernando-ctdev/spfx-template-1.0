/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          start: '#2563eb', // blue-600
          end: '#7c3aed',   // violet-600
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Desabilitar preflight para evitar conflitos com estilos globais do SharePoint
  }
}
