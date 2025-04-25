/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    safelist: [
      'bg-hoverColor',
      'hover:bg-hoverColor',
      'data-[state=open]:bg-hoverColor',
      'data-[state=open]:hover:bg-hoverColor',
    ],
    theme: {
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px)
  
        'md': '768px',
        // => @media (min-width: 768px)
  
        'lg': '1024px',
        // => @media (min-width: 1024px)
  
        'xl': '1280px',
        // => @media (min-width: 1280px)
      },
      extend: {
        colors: {
          primaryColor: '#0a0a0a', // black
          secondryColor: '#0C0C0C', // white
          hoverColor: '#0284c7', // blue
        },
        container: {
          center: true,
          padding: {
            DEFAULT: '1rem',
          }
        }
      },
    },
    plugins: [],
  }