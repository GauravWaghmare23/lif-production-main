/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0D0D0E',
        'surface-elevated': '#141416',
        charcoal: '#18181A',
        'cine-gray': '#3A3A3E',
        'cine-muted': '#9E9EA4',
        'warm-white': '#F5F5F7',
        // Multi-Shade Blue & Cyan Theme Palette
        'cine-amber': '#0052FF', // Cobalt Blue
        'cine-gold': '#00F0FF',  // Bright Cyan / Ice Blue
        'cine-yellow': '#60A5FA',// Light Blue
        'cine-orange': '#0EA5E9',// Azure Blue
        'cine-glow': 'rgba(0, 102, 255, 0.45)',
        'cine-red': '#0066FF',   // Electric Blue
        'cine-cobalt': '#0052FF',
        'cine-cyan': '#00F0FF',
        'cine-sky': '#38BDF8',
        'cine-indigo': '#6366F1',
        'cine-sapphire': '#1E40AF',
        'cine-azure': '#0EA5E9',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        condensed: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        editorial: ['Cinzel', 'serif'],
        sans: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(0, 102, 255, 0.7))' },
        }
      }
    },
  },
  plugins: [],
}
