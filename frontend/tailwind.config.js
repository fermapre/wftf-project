/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          pink: '#DB37B4',       // Rosa principal
          lightPink: '#FDDDF5',  // Fondos pastel de tarjetas
          bg: '#FFFDF6',         // Fondo general neutro
          bgTwo: '#FFEDD2',         // Fondo general neutro 2
          darkPurple: '#69358C',        // Morado oscuro para algunos títulos, textos y todos los bordes
          darkBlue: '#0B0089',        // Azul oscuro para algunos títulos o subtítulos
          lightBlue: '#A4B4E4',        // Azul bajito para fondos
          yellow: '#EA920A',        // Amarillo para las estrellas EC4F1C
          orange: '#EC4F1C',        // Naranja para las estrellas 
        }
      },
      fontFamily: {
        title: ['StylishHandwriting', 'sans-serif'],
        hand: ['GratefulMemories', 'cursive'],
        body: ['Dantesque', 'sans-serif'],
      },
    },
  },
  plugins: [],
}