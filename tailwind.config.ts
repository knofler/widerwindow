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
        brand: { DEFAULT: '#2563eb', light: '#3b82f6', dark: '#1d4ed8' },
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
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif']
      },
      fontSize: {
        'fluid-hero': ['clamp(2.75rem, 6vw, 4.25rem)', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.035em' }],
        'fluid-title': ['clamp(2rem,4.5vw,3rem)', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.03em' }]
      },
      backgroundImage: {
        'gradient-radial-soft': 'radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.22),transparent 65%)',
        'gradient-radial-alt': 'radial-gradient(circle_at_80%_70%,rgba(29,78,216,0.18),transparent 70%)'
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
            maxWidth: '70ch',
            lineHeight: '1.7',
            p: { lineHeight: '1.7' },
            h1: { fontFamily: theme('fontFamily.serif').join(','), fontSize: theme('fontSize.fluid-title')[0], lineHeight: '1.05', letterSpacing: '-0.035em' },
            h2: { fontFamily: theme('fontFamily.serif').join(','), letterSpacing: '-0.03em', marginTop: '2.4em', marginBottom: '0.9em' },
            h3: { fontFamily: theme('fontFamily.serif').join(','), letterSpacing: '-0.02em', marginTop: '2em', marginBottom: '0.6em' },
            a: { fontWeight: '600', textDecoration: 'none', borderBottom: '1px solid ' + theme('colors.brand.DEFAULT') + '33' },
            'a:hover': { borderBottomColor: theme('colors.brand.DEFAULT') },
            code: { backgroundColor: theme('colors.gray.100'), padding: '0.25rem 0.4rem', borderRadius: '0.5rem', fontSize: '0.85em' },
            pre: { backgroundColor: theme('colors.gray.900'), color: theme('colors.gray.100'), padding: '1.1rem 1.25rem', borderRadius: '1rem', border: '1px solid ' + theme('colors.gray.800') },
            blockquote: { borderLeftColor: theme('colors.brand.DEFAULT'), backgroundColor: theme('colors.gray.50'), padding: '0.9rem 1.25rem', fontStyle: 'normal' }
          }
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.gray.50'),
            '--tw-prose-links': theme('colors.brand.light'),
            '--tw-prose-code': theme('colors.brand.light'),
            a: { borderBottom: '1px solid ' + theme('colors.brand.light') + '44' },
            code: { backgroundColor: theme('colors.gray.800'), color: theme('colors.brand.light') },
            pre: { backgroundColor: theme('colors.gray.800'), border: '1px solid ' + theme('colors.gray.750') },
            blockquote: { backgroundColor: theme('colors.gray.800'), borderLeftColor: theme('colors.brand.light') }
          }
        }
      })
    }
  },
  plugins: [typography]
};
export default config;
