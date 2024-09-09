// eth-price.js
const https = require('https');

function getCryptoPrices() {
  return new Promise((resolve, reject) => {
    const cryptoIds = 'bitcoin,ethereum,solana,uniswap,arbitrum,chainlink,ripple';
    https.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        const prices = JSON.parse(data);
        const headers = ['Crypto', 'Price (USD)', '24h Change (%)'];
        const order = ['bitcoin', 'ethereum', 'solana', 'uniswap', 'arbitrum', 'chainlink', 'ripple'];
        const rows = order.map(id => {
          const data = prices[id];
          return [
            id.charAt(0).toUpperCase() + id.slice(1),
            `$${data.usd.toFixed(2)}`,
            `${data.usd_24h_change.toFixed(2)}%`
          ];
        });
        
        const result = formatTable(headers, rows);
        resolve(result);
      });
    }).on("error", (err) => {
      reject(`Error: ${err.message}`);
    });
  });
}

function formatTable(headers, rows) {
  const maxLengths = headers.map((h, i) => 
    Math.max(h.length, ...rows.map(r => r[i].length))
  );
  
  const formatRow = (row) => 
    '| ' + row.map((cell, i) => cell.padEnd(maxLengths[i])).join(' | ') + ' |';
  
  const separator = '+' + maxLengths.map(len => '-'.repeat(len + 2)).join('+') + '+';
  
  return [
    separator,
    formatRow(headers),
    separator,
    ...rows.map(formatRow),
    separator
  ].join('\n');
}

getCryptoPrices().then(console.log).catch(console.error);