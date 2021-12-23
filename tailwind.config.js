module.exports = {
  mode: 'jit',
  content: ['./app/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'dark-radial-body':
          'radial-gradient(circle, rgba(58,24,47,1) 0%, rgba(17,24,39,1) 100%)',
      },
    },
  },
  plugins: [],
};
