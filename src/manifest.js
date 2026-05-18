module.exports = {
  id: process.env.ADDON_ID || 'com.movix.stremio',
  version: '1.0.0',
  name: process.env.ADDON_NAME || 'Movix',
  description: 'Stremio addon for movix.tax - Films et series en streaming',
  logo: 'https://movix.tax/favicon.ico',
  resources: ['catalog', 'meta', 'stream'],
  types: ['movie', 'series'],
  catalogs: [
    {
      id: 'movix_movies',
      type: 'movie',
      name: 'Movix Films',
      extra: [{ name: 'search', isRequired: false }, { name: 'skip' }]
    },
    {
      id: 'movix_series',
      type: 'series',
      name: 'Movix Series',
      extra: [{ name: 'search', isRequired: false }, { name: 'skip' }]
    }
  ],
  behaviorHints: { adult: false, p2p: false }
};
