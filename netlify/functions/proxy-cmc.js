import fetch from 'node-fetch';

export async function handler(event) {
  const { path, symbol, limit, time_start, time_end, interval } = event.queryStringParameters || {};

  const base = 'https://pro-api.coinmarketcap.com/v1';
  const urlPath = `${base}${path}`;
  const params = new URLSearchParams();

  if (limit)      params.set('limit', limit);
  if (symbol)     params.set('symbol', symbol);
  if (time_start) params.set('time_start', time_start);
  if (time_end)   params.set('time_end', time_end);
  if (interval)   params.set('interval', interval);

  const url = `${urlPath}?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_KEY }
  });
  const body = await response.text();

  return {
    statusCode: response.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body
  };
}
