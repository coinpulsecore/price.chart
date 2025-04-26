// Proxy any CoinGecko URL to avoid CORS
exports.handler = async function(event) {
    try {
      const params = event.queryStringParameters || {};
      const url = params.url; 
      if (!url) {
        return { statusCode: 400, headers:{'Access-Control-Allow-Origin':'*'},
                 body: JSON.stringify({ error:'Missing "url" parameter' }) };
      }
      const resp = await fetch(url);
      const text = await resp.text();
      return {
        statusCode: resp.status,
        headers: {
          'Access-Control-Allow-Origin':'*',
          'Content-Type':'application/json'
        },
        body: text
      };
    } catch(err) {
      return {
        statusCode: 500,
        headers: {'Access-Control-Allow-Origin':'*'},
        body: JSON.stringify({ error: err.message })
      };
    }
  };
  