# Node.js + Express Real-time Price Tracker & Digital Clock

A simple, lightweight Node.js + Express web server with a real-time digital clock and random walk price ticker.

## Features
- **Real-time Digital Clock**: Updates every second with current time and date.
- **Dynamic Asset Price**: Starts at `$100.00` and updates randomly every 5 seconds.
- **REST API**: Provides `GET /price` returning `{ "price": <number> }`.
- **Modern UI**: Dark-mode glassmorphic interface with countdown sync progress bar and price flash indicator.
- **Self-contained**: Vanilla HTML, CSS, and JavaScript with no external frontend dependencies.

## Installation & Running

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
