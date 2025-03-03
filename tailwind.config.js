/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"], // Asegura que Tailwind escanee tus archivos
    theme: {
      extend: {
        backgroundImage: {
          'dots': "radial-gradient(circle, rgba(255,200,0,0.5) 1px, transparent 1px)",
        },
        textShadow: {
          'led': "0 0 3px #ffcc00, 0 0 6px #ff9900, 0 0 9px rgba(255,165,0,0.8)",
        },
      },
    },
    plugins: [],
  };
  