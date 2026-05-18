const axios = require('axios');
const cheerio = require('cheerio');
const BASE_URL = process.env.MOVIX_BASE_URL || 'https://movix.tax';

async function fetchPage(url) {
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StremioAddon/1.0)' },
    timeout: 10000
  });
  return cheerio.load(res.data);
}

async function getMovies(skip = 0, search = '') {
  try {
    let url = search
      ? `${BASE_URL}/?s=${encodeURIComponent(search)}`
      : `${BASE_URL}/films/page/${Math.floor(skip / 20) + 1}/`;
    const $ = await fetchPage(url);
    const items = [];
    $('article, .post, .movie-item, .item').each((i, el) => {
      const title = $(el).find('h2, h3, .title, .entry-title').first().text().trim();
      const link = $(el).find('a').first().attr('href');
      const img = $(el).find('img').first().attr('src') || '';
      if (title && link) {
        const id = 'movix_' + Buffer.from(link).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
        items.push({ id, type: 'movie', name: title, poster: img, link });
      }
    });
    return items;
  } catch (e) {
    console.error('Error fetching movies:', e.message);
    return [];
  }
}

async function getSeries(skip = 0, search = '') {
  try {
    let url = search
      ? `${BASE_URL}/?s=${encodeURIComponent(search)}`
      : `${BASE_URL}/series/page/${Math.floor(skip / 20) + 1}/`;
    const $ = await fetchPage(url);
    const items = [];
    $('article, .post, .serie-item, .item').each((i, el) => {
      const title = $(el).find('h2, h3, .title, .entry-title').first().text().trim();
      const link = $(el).find('a').first().attr('href');
      const img = $(el).find('img').first().attr('src') || '';
      if (title && link) {
        const id = 'movix_' + Buffer.from(link).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
        items.push({ id, type: 'series', name: title, poster: img, link });
      }
    });
    return items;
  } catch (e) {
    console.error('Error fetching series:', e.message);
    return [];
  }
}

async function getStreams(link) {
  try {
    const $ = await fetchPage(link);
    const streams = [];
    $('iframe, source, video').each((i, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      if (src && (src.includes('http') || src.startsWith('//'))) {
        streams.push({ title: 'Movix Stream ' + (i + 1), url: src.startsWith('//') ? 'https:' + src : src });
      }
    });
    return streams;
  } catch (e) {
    console.error('Error fetching streams:', e.message);
    return [];
  }
}

module.exports = { getMovies, getSeries, getStreams };
