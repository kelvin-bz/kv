# Create a Command Line Tool for Displaying Cryptocurrency Prices

```
+----------+-------------+----------------+
| Crypto   | Price (USD) | 24h Change (%) |
+----------+-------------+----------------+
| Bitcoin  | $29345.67   | -0.12%         |
| Ethereum | $1876.23    | 0.34%          |
| Solana   | $23.45      | 2.56%          |
| Uniswap  | $5.67       | 1.45%          |
| Arbitrum | $1.23       | -0.78%         |
| Chainlink| $7.89       | 0.67%          |
| Ripple   | $0.45       | -1.23%         |
+----------+-------------+----------------+
```



1. Create the scripts directory (if it doesn't exist):
   ```
   mkdir -p ~/scripts
   ```

2. Create the main script file:
   ```
   nano ~/scripts/fav-crypto.js.js
   ```

3. In the nano editor, paste the following content:



```javascript
// fav-crypto.js.js
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

```

4. Save and exit nano (Ctrl+X, then Y, then Enter).

5. Make the script executable:
   ```
   chmod +x ~/scripts/fav-crypto.js.js
   ```

6. Create the wrapper script:
   ```
   nano ~/scripts/kv
   ```

7. In the nano editor, paste the following content:



```bash
#!/bin/bash
node ~/scripts/fav-crypto.js.js

```

8. Save and exit nano (Ctrl+X, then Y, then Enter).

9. Make the wrapper script executable:
   ```
   chmod +x ~/scripts/kv
   ```

10. Add the scripts directory to your PATH. Open your shell configuration file:
    ```
    nano ~/.zshrc  # If you're using Zsh (default on newer macOS versions)
    ```
    or
    ```
    nano ~/.bash_profile  # If you're using Bash
    ```

11. Add the following line at the end of the file:
    ```
    export PATH="$PATH:$HOME/scripts"
    ```

12. Save and exit nano (Ctrl+X, then Y, then Enter).

13. Apply the changes to your current session:
    ```
    source ~/.zshrc  # If you're using Zsh
    ```
    or
    ```
    source ~/.bash_profile  # If you're using Bash
    ```

Now you can use the `kv` command from anywhere in your terminal. To test it, simply type:
```
kv
```

This will execute the Node.js script and display a table of cryptocurrency prices and their 24-hour changes.

The output will look something like this:

```
+----------+-------------+----------------+
| Crypto   | Price (USD) | 24h Change (%) |
+----------+-------------+----------------+
| Bitcoin  | $29345.67   | -0.12%         |
| Ethereum | $1876.23    | 0.34%          |
| Solana   | $23.45      | 2.56%          |
| Uniswap  | $5.67       | 1.45%          |
| Arbitrum | $1.23       | -0.78%         |
| Chainlink| $7.89       | 0.67%          |
| Ripple   | $0.45       | -1.23%         |
+----------+-------------+----------------+
```

This setup will persist across system restarts because the scripts directory is added to your PATH.

