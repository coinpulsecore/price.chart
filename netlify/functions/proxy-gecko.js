// netlify/functions/proxy-gecko.js
exports.handler = async function(event) {
    const params = event.queryStringParameters || {};
    const url    = params.url;
    if (!url) {
      return { statusCode: 400, headers:{'Access-Control-Allow-Origin':'*'},
               body: JSON.stringify({ error:'Missing "url" parameter' }) };
    }
    try {
      const resp = await fetch(url);
      const data = await resp.text();
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin':'*','Content-Type':'application/json' },
        body: data
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: {'Access-Control-Allow-Origin':'*'},
        body: JSON.stringify({ error: err.message })
      };
    }
  };
  