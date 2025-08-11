import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
        // Neutral surface scale refined
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          150: '#e5eaf1',
          200: '#e2e8f0',
          250: '#cdd5e0',
          300: '#c0cad4',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          650: '#3b4858',
          700: '#334155',
          750: '#2b3645',
          800: '#1e2733',
          850: '#19212c',
          900: '#141b23',
          950: '#0d1217'
        },
        surface: {
          DEFAULT: '#1e2733',
          subtle: '#141b23',
          elevated: '#2b3645'
        }
      },
      backgroundImage: {
        'gradient-radial-soft': 'radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent 65%)',
        'gradient-radial-alt': 'radial-gradient(circle_at_80%_70%,rgba(79,70,229,0.18),transparent 70%)'
      },
      boxShadow: {
        card: '0 4px 18px -4px rgba(0,0,0,0.25)',
        'card-hover': '0 8px 28px -6px rgba(0,0,0,0.35)'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 0.55 }, '50%': { opacity: 1 } },
        shimmer: { '100%': { transform: 'translateX(100%)' } }
      },
      animation: {
        fadeIn: 'fadeIn .4s ease-out',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite'
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray.600'),
            '--tw-prose-headings': theme('colors.gray.900'),
            '--tw-prose-links': theme('colors.brand.DEFAULT'),
            '--tw-prose-code': theme('colors.brand.dark'),
            a: { fontWeight: '600' },
            code: { backgroundColor: theme('colors.gray.100'), padding: '0.25rem 0.4rem', borderRadius: '0.375rem' },
            blockquote: { borderLeftColor: theme('colors.brand.DEFAULT'), backgroundColor: theme('colors.gray.50'), padding: '0.6rem 1rem' }
          }
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.gray.50'),
            '--tw-prose-links': theme('colors.brand.light'),
            '--tw-prose-code': theme('colors.brand.light'),
            code: { backgroundColor: theme('colors.gray.800'), color: theme('colors.brand.light') },
            blockquote: { backgroundColor: theme('colors.gray.800'), borderLeftColor: theme('colors.brand.light') }
          }
        }
      })
    }
  },
  plugins: [typography]
};
export default config;
