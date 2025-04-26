// netlify/functions/proxy-cmc.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const params = event.queryStringParameters || {};
    const path   = params.path;
    if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "path" parameter' }),
      };
    }

    // Build the CMC URL
    const base = 'https://pro-api.coinmarketcap.com/v1';
    const url  = `${base}${path}?${new URLSearchParams(params).toString()}`;

    // Call CMC
    const resp = await fetch(url, {
      headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_KEY }
    });

    const text = await resp.text();
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