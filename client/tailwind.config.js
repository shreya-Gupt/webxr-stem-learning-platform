/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stem: {
          void: '#05070D',
          dark: '#0A0E1A',
          card: '#10172A',
          cardHover: '#162038',
          border: '#1E293B',
          cyan: '#00F0FF',
          blue: '#38BDF8',
          purple: '#818CF8',
          violet: '#A855F7',
          neonGreen: '#10B981',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 25px -5px rgba(129, 140, 248, 0.3)',
        'neon-green': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
