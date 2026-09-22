/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#06130d',
          900: '#0b1e16',
          850: '#10281e',
          800: '#16382a',
          700: '#1f4d3a',
          600: '#2a694f',
          500: '#10b981',
          400: '#34d399',
          300: '#6ee7b7',
        },
        slate: {
          950: '#0a0d12',
          900: '#0f172a',
          850: '#141d33',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
        },
        ochre: {
          500: '#d97706',
          400: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(16,185,129,0.15), 0 10px 40px -10px rgba(16,185,129,0.25)',
      }
    },
  },
  plugins: [],
}
