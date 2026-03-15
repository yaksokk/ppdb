/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#0F2B5B',
        'dark-blue-2': '#1A3A6B',
        primary: '#2563EB',
        'primary-dark': '#1D4ED8',
        'primary-light': '#EFF6FF',
        cyan: '#06B6D4',
        'cyan-dark': '#0891B2',
        'cyan-light': '#ECFEFF',
        success: '#16A34A',
        'success-light': '#F0FDF4',
        danger: '#DC2626',
        'danger-light': '#FEF2F2',
        warning: '#D97706',
        'warning-light': '#FFFBEB',
        n50: '#F8FAFC',
        n100: '#F1F5F9',
        n200: '#E2E8F0',
        n300: '#CBD5E1',
        n400: '#94A3B8',
        n500: '#64748B',
        n600: '#475569',
        n700: '#334155',
        n800: '#1E293B',
        n900: '#0F172A',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,.04)',
        'sm': '0 1px 6px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        'md': '0 4px 16px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04)',
        'lg': '0 10px 36px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)',
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px',
        'md': '14px',
        'lg': '18px',
        'xl': '22px',
        'pill': '999px',
      },
      keyframes: {
        modalIn: {
          from: { opacity: '0', transform: 'scale(.95) translateY(8px)' },
          to:   { opacity: '1', transform: 'none' },
          },
      },
      animation: {
        modalIn: 'modalIn .18s cubic-bezier(.34,1.56,.64,1)',
      },
    },
  },
  plugins: [],
}