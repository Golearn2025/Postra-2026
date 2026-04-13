import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './config/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        // --- Sidebar / dark surfaces ---
        sidebar: {
          bg: '#0d0f14',
          surface: '#13161e',
          border: '#1e2130',
          hover: '#1a1d28',
          active: '#1f2235',
          text: '#94a3b8',
          'text-active': '#f1f5f9',
          'text-muted': '#4b5563',
        },
        // --- Content area ---
        canvas: {
          bg: '#f5f6fa',
          card: '#ffffff',
          border: '#e4e7ef',
          'border-subtle': '#eef0f6',
        },
        // --- Accent (violet/indigo) ---
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          subtle: '#eef2ff',
          muted: '#c7d2fe',
          foreground: '#ffffff',
        },
        // --- Semantic statuses ---
        status: {
          success: '#22c55e',
          'success-bg': '#f0fdf4',
          'success-text': '#15803d',
          warning: '#f59e0b',
          'warning-bg': '#fffbeb',
          'warning-text': '#b45309',
          error: '#ef4444',
          'error-bg': '#fef2f2',
          'error-text': '#b91c1c',
          info: '#3b82f6',
          'info-bg': '#eff6ff',
          'info-text': '#1d4ed8',
          muted: '#64748b',
          'muted-bg': '#f8fafc',
        },
        // shadcn / radix token overrides (required for shadcn components)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px 0 rgba(0,0,0,0.08), 0 1px 3px -1px rgba(0,0,0,0.04)',
        'card-lg': '0 8px 24px 0 rgba(0,0,0,0.10), 0 2px 6px -2px rgba(0,0,0,0.05)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
}

export default config
