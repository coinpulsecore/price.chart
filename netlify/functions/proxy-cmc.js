// netlify/functions/proxy-cmc.js
const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const params = event.queryStringParameters || {};
    const path   = params.path;
    if (!path) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing “path” query parameter' })
      };
    }

    // Pull out `path`, leave the rest as query params
    const { path: _, ...rest } = params;
    const qs = new URLSearchParams(rest).toString();
    const url = `https://pro-api.coinmarketcap.com/v1${path}?${qs}`;

    console.log('proxy-cmc fetching URL:', url);

    const resp = await fetch(url, {
      headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_KEY }
    });

    const text = await resp.text();
    console.log('proxy-cmc status:', resp.status, 'body length:', text.length);

    return {
      statusCode: resp.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: text
    };
  } catch (err) {
    console.error('proxy-cmc error:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
