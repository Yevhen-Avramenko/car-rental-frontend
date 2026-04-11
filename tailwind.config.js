

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#C45E1A',
          dark:    '#A34D14',
          light:   '#F2EDE6',
        },
        warm: {
          cream:  '#FDFAF6',
          sand:   '#F5F0E8',
          border: '#E0DAD2',
          muted:  '#7A7268',
          ink:    '#1A1208',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:  '6px',
        md:  '10px',
        lg:  '14px',
        xl:  '20px',
        '2xl': '28px',
      },
    },
  },
  plugins: [],
} 

