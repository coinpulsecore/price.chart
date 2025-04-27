// netlify/functions/proxy-gecko.js
exports.handler = async function(event) {
    const url = event.queryStringParameters?.url;
    if (!url) {
      return {
        statusCode: 400,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({ error: 'Missing "url" parameter' })
      };
    }
    try {
      const resp = await fetch(url);
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
      return {
        statusCode: 500,
        headers: {'Access-Control-Allow-Origin': '*'},
        body: JSON.stringify({ error: err.message })
      };
    }
  };
  