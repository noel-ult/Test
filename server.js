const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Base starting price
const BASE_PRICE = 100.00;

// Time-synchronized price calculator (5-second intervals)
// Ensures SSR (GET /) and API (GET /price) are always 100% consistent,
// even across serverless/Vercel instances where background setInterval is paused.
function calculatePriceForWindow(windowIndex) {
  const seed = (windowIndex * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  const trend = Math.sin(windowIndex * 0.12) * 6.5 + Math.cos(windowIndex * 0.05) * 3.2;
  const noise = (rnd * 4.0) - 2.0;
  const price = Math.max(10.00, BASE_PRICE + trend + noise);
  return Number(price.toFixed(2));
}

function getCurrentPrice() {
  const windowIndex = Math.floor(Date.now() / 5000);
  return calculatePriceForWindow(windowIndex);
}

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
  const currentPrice = getCurrentPrice();

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

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderedHtml);
});

// API endpoint returning current price in JSON format with strict cache-busting headers
app.get('/price', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({ price: getCurrentPrice() });
});

// Interval logger for long-running server environments
let lastLoggedWindow = Math.floor(Date.now() / 5000);
setInterval(() => {
  const currentWindow = Math.floor(Date.now() / 5000);
  if (currentWindow !== lastLoggedWindow) {
    const prevPrice = calculatePriceForWindow(lastLoggedWindow);
    const newPrice = calculatePriceForWindow(currentWindow);
    const diff = +(newPrice - prevPrice).toFixed(2);
    const sign = diff >= 0 ? '+' : '';

    console.log(`[${getTimestamp()}] Price updated: $${newPrice.toFixed(2)} (${sign}${diff.toFixed(2)})`);
    lastLoggedWindow = currentWindow;
  }
}, 1000);

// Start server when run directly
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('==============================================');
    console.log(` Server started on port ${PORT}`);
    console.log(` Web UI:   http://localhost:${PORT}`);
    console.log(` API:      http://localhost:${PORT}/price`);
    console.log(` Initial price: $${getCurrentPrice().toFixed(2)}`);
    console.log(' Updates will occur every 5 seconds');
    console.log('==============================================');
  });
}

module.exports = app;
