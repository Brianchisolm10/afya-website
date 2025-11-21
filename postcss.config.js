module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // PurgeCSS is built into Tailwind CSS v3+
    // Additional optimization for production
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          minifyFontValues: true,
          minifyGradients: true,
        }],
      },
    } : {}),
  },
}
