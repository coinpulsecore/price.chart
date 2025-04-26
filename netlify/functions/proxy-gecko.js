// netlify/functions/proxy-gecko.js
const fetch = require('node-fetch');

let cache = {};  // Memory cache (reset every deploy)

exports.handler = async (event, context) => {
  const url = event.queryStringParameters.url;
  if (!url) {
    return { statusCode: 400, body: 'Missing URL' };
  }

  // Check if we already have cached response
  if (cache[url] && (Date.now() - cache[url].timestamp < 15 * 60 * 1000)) {
    console.log('Serving from cache:', url);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cache[url].data)
    };
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Store in cache
    cache[url] = {
      timestamp: Date.now(),
      data
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
