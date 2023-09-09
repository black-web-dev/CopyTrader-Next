import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: '400px',
      },
      colors: {
        'back-100': '#0A0D13',
        'back-200': '#14161D',
        'back-300': '#808aff14',
        'back-400': '#0A0D16',
        'gradient-100': '#1e223de6',
        'gradient-200': '#262b47e6',
        'hover-100': '#3a3f798f',
        'hover-200': '#4d5ffa',
        'border-100': '#ffffff10',
        'border-200': '#ffffff29',
        'text-100': 'rgba(255, 255, 255, 0.40)',
        'text-200': '#eee',
        'primary-100': '#0171D9',
      },
      boxShadow: {
        inputFocus: '0 0 10px 2px rgb(255 255 255 / 29%)',
      },
      backgroundImage: {
        subHeader: "url('/images/home/sub_header.png')",
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
        ripple: {
          to: { transform: 'scale(4)', opacity: '1' },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
        ripple: 'ripple 600ms linear',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')],
  variants: {
    scrollbar: ['rounded'],
  },
} satisfies Config;
