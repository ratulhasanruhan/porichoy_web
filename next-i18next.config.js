module.exports = {
  i18n: {
    defaultLocale: 'bn',
    locales: ['bn', 'en'],
    localeDetection: false, // Set to false to avoid conflicts with Next.js App Router
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}

