/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        card: '#FFFFFF',
        ink: {
          DEFAULT: '#101418',
          muted: '#5C6672',
          subtle: '#8C96A2',
        },
        line: {
          DEFAULT: '#E6E4DC',
          soft: '#EFEEE8',
        },
        signal: {
          DEFAULT: '#0E6E5C',
          ink: '#0A4A3F',
          soft: '#EFF5F2',
          border: '#CFE0D8',
        },
        amber: {
          DEFAULT: '#B7791F',
          ink: '#7B4A12',
          soft: '#FEF7EC',
          border: '#F6E0B5',
        },
        danger: {
          DEFAULT: '#A93226',
          ink: '#78241C',
          soft: '#FAF0EC',
          border: '#E4C4B2',
        },
        // Backward compatibility mappings to prevent breaks
        canvas: {
          deep: '#FAFAF8',
          base: '#FAFAF8',
          surface: '#FFFFFF',
          elevated: '#F5F4EF',
          card: '#FFFFFF',
          border: '#E6E4DC',
          'border-subtle': '#EFEEE8',
        },
        brand: {
          blue: '#101418',
          cyan: '#0E6E5C',
          indigo: '#101418',
          purple: '#0E6E5C',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(16, 20, 24, 0.05), 0 1px 2px rgba(16, 20, 24, 0.03)',
        'card': '0 4px 20px -2px rgba(16, 20, 24, 0.06), 0 2px 6px -1px rgba(16, 20, 24, 0.03)',
        'elevated': '0 18px 48px rgba(16, 20, 24, 0.08)',
        'modal': '0 24px 64px -12px rgba(16, 20, 24, 0.14)',
        // Compatibility shadows (neutral, non-glowing)
        'glow-sm': '0 2px 8px rgba(16, 20, 24, 0.06)',
        'glow-md': '0 4px 16px rgba(16, 20, 24, 0.08)',
        'glow-error': '0 4px 18px rgba(169, 50, 38, 0.12)',
        'glow-brand': '0 4px 18px rgba(14, 110, 92, 0.12)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'fade-slide-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'fade-slide-in': 'fade-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}
