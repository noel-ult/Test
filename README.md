# Price tracker and digital clock

A small Express application that server-renders a clock and a simulated price, then lets the browser refresh the display. The price is synthetic and is not connected to a market-data provider.

## Run

```sh
npm ci
npm start
```

Open http://localhost:3000. Set the shell environment variable `PORT` to change the listening port. There is no database or required secret.

## How it works

`server.js` serves assets from `public/` and renders `public/index.html` itself for `GET /`. `GET /price` returns a JSON object such as `{"price": 102.34}`. Both responses disable caching.

The price function uses a base of 100 plus deterministic trend and noise terms for the current five-second time window, with a floor of 10. It does not start at exactly 100 or follow a stateful random walk. The HTML and API agree when evaluated in the same window; requests across a boundary can differ. A one-second interval logs window changes on long-running servers, but price calculation does not depend on that interval.

## Check and deploy

```sh
curl -i http://localhost:3000/price
```

Check that the response has a numeric `price` and no-store headers, then observe the browser clock and price across several windows. `vercel.json` provides the repository's Vercel routing configuration; the Express app is exported from `server.js` for that environment. A conventional Node host can use `npm start`.

No automated tests, lint script, or build step is declared. Edit the HTML for presentation and `calculatePriceForWindow` for the simulation.

## More documentation

- [Source, command, and configuration reference](docs/REFERENCE.md)
- [Contributing](CONTRIBUTING.md)
