// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Botigues Obertes Terrassa',

  // Preconfigured for Netlify.
  siteUrl: process.env.BRANCH
    ? process.env.BRANCH == 'master'
      ? process.env.URL
      : process.env.DEPLOY_PRIME_URL
    : 'https://localhost',

  pathPrefix: process.env.BASE_DIR || '',

  titleTemplate: `%s | Gridsome`,

  plugins: [
    {
      use: 'gridsome-plugin-tailwindcss',
      options: {
        tailwindConfig: './tailwind.config.js',
        shouldPurge: false,
        presetEnvConfig: {},
        shouldImport: true,
        shouldTimeTravel: true,
      },
    },
    {
      use: '@gridsome/plugin-sitemap',
    },
    {
      use: '~/plugins/google-sheets',
      options: {
        sheetId: process.env.SHEET_ID,
        apiKey: process.env.GOOGLE_API_KEY,
        cachePath: process.env.CACHE_PATH || '.geocoder-cache',
        type: 'shop',
      },
    },
    {
      use: 'gridsome-plugin-svg',
      options: {
        svgo: [{ removeViewBox: false }],
      },
    },
    {
      use: 'gridsome-plugin-manifest',
      options: {
        background_color: '#fff',
        icon_path: './src/favicon.png',
        name: 'Botigues Obertes Terrassa',
        short_name: 'botiguesobertes',
        theme_color: '#000',
        lang: 'ca',
        orientation: 'landscape',
      },
    },
  ],
}
