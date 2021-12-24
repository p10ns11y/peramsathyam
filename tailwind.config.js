const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'dark-radial-body':
          'radial-gradient(circle, rgba(58,24,47,1) 0%, rgba(17,24,39,1) 100%)',
      },
      boxShadow: {
        glowing:
          'rgba(254, 88, 254, 0.1) 0px 0px 0px 2px, rgba(254, 102, 0, 0.52) -15px 0px 30px -15px, rgba(255, 28, 172, 0.608) 0px 0px 30px -15px, rgba(111, 82, 255, 0.733) 15px 0px 30px -15px',
      },
      fontFamily: {
        mono: ['Roboto Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
