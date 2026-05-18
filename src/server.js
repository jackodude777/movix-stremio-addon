require('dotenv').config();
const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const manifest = require('./manifest');
const scraper = require('./scraper');

const builder = new addonBuilder(manifest);

// Catalog handler
builder.defineCatalogHandler(async ({ type, id, extra }) => {
  const skip = parseInt(extra?.skip) || 0;
  const search = extra?.search || '';
  let metas = [];
  if (type === 'movie') {
    metas = await scraper.getMovies(skip, search);
  } else if (type === 'series') {
    metas = await scraper.getSeries(skip, search);
  }
  return { metas };
});

// Meta handler
builder.defineMetaHandler(async ({ type, id }) => {
  return {
    meta: {
      id,
      type,
      name: id.replace('movix_', ''),
      description: 'Contenu de movix.tax'
    }
  };
});

// Stream handler
builder.defineStreamHandler(async ({ type, id }) => {
  try {
    const linkB64 = id.replace('movix_', '');
    const link = Buffer.from(linkB64, 'base64').toString('utf8');
    const streams = await scraper.getStreams(link);
    return { streams };
  } catch (e) {
    console.error(e);
    return { streams: [] };
  }
});

const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });
console.log('Movix Stremio Addon running on port ' + PORT);
