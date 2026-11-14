/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#070A0F', // deep abyss background
          900: '#0B0F17', // primary obsidian slate
          850: '#111723', // card surface
          800: '#172030', // elevated surface
          700: '#233045', // border subtle
          600: '#334460', // border strong
        },
        sage: {
          400: '#34D399',
          500: '#10B981', // electric sage
          600: '#059669', // deep sage
          700: '#047857',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        brass: {
          400: '#FBBF24',
          500: '#F59E0B', // metallic amber/brass
          600: '#D97706',
          glow: 'rgba(245, 158, 11, 0.22)',
        },
        ivory: {
          50: '#FCFDFE',
          100: '#F8F9FA', // warm ivory
          200: '#F1F3F5',
          300: '#E5E7EB',
          400: '#D1D5DB',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Fraunces', 'Georgia', 'serif'],
        display: ['"Fraunces"', '"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'radial-ambient': 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12) 0%, rgba(11, 15, 23, 0) 70%)',
        'radial-amber': 'radial-gradient(circle at 100% 0%, rgba(245, 158, 11, 0.08) 0%, rgba(11, 15, 23, 0) 60%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'sage-glow': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'brass-glow': '0 0 25px -4px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

