const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Initial state
let currentPrice = 100.00;

// Log helper
function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// Serve static assets from public folder (disable automatic index.html serving)
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Root route - Server-Side Rendered (SSR)
app.get('/', (req, res) => {
  const templatePath = path.join(__dirname, 'public', 'index.html');
  const template = fs.readFileSync(templatePath, 'utf8');
  const now = new Date();

  const timeStr = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const renderedHtml = template
    .replace(
      /<span class="price-value" id="priceDisplay">[^<]*<\/span>/,
      `<span class="price-value" id="priceDisplay">${currentPrice.toFixed(2)}</span>`
    )
    .replace(
      /<div class="time-display" id="clockDisplay">[^<]*<\/div>/,
      `<div class="time-display" id="clockDisplay">${timeStr}</div>`
    )
    .replace(
      /<div class="date-display" id="dateDisplay">[^<]*<\/div>/,
      `<div class="date-display" id="dateDisplay">${dateStr}</div>`
    )
    .replace(
      '<!-- SSR_TIMESTAMP -->',
      `<!-- SSR Rendered: ${now.toISOString()} -->\n  <meta name="ssr-rendered-at" content="${now.toISOString()}">`
    );

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderedHtml);
});

// API endpoint returning current price in JSON format
app.get('/price', (req, res) => {
  res.json({ price: Number(currentPrice.toFixed(2)) });
});

// Update price every 5 seconds
setInterval(() => {
  // Generate a random step between 0.10 and 5.00, with positive or negative sign
  const delta = (Math.random() * 4.9 + 0.1) * (Math.random() < 0.5 ? -1 : 1);
  const oldPrice = currentPrice;
  
  // Update price and ensure it stays positive with 2 decimal precision
  currentPrice = Math.max(1.00, +(currentPrice + delta).toFixed(2));
  const actualDiff = +(currentPrice - oldPrice).toFixed(2);
  const sign = actualDiff >= 0 ? '+' : '';

  console.log(`[${getTimestamp()}] Price updated: $${currentPrice.toFixed(2)} (${sign}${actualDiff.toFixed(2)})`);
}, 5000);

// Start server
app.listen(PORT, () => {
  console.log('==============================================');
  console.log(` Server started on port ${PORT}`);
  console.log(` Web UI:   http://localhost:${PORT}`);
  console.log(` API:      http://localhost:${PORT}/price`);
  console.log(` Initial price: $${currentPrice.toFixed(2)}`);
  console.log(' Updates will occur every 5 seconds');
  console.log('==============================================');
});
