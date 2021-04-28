const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// const { RESTClient } = require('cw-sdk-node')
const axios = require('axios')
const utils = require('./utils/utils');
const got = require('got');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//
// const client = new RESTClient({
//   creds: {
//     apiKey: "NPB0Z2I1QFUJQZ7JYA0C" // your cw api key
//   }
// });

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/ohlc/:pair', (req, res) => {
  (async () => {
  	try {
      console.log('request started')
  		const response = await got(`https://api.cryptowat.ch/markets/kraken/${req.params.pair}usd/ohlc`);
      let candles = JSON.parse(response.body)
      let results = candles.result
      windows = Object.keys(results).map((key, idx) => {
        let ohlcs = results[key],
            dates = ohlcs.map(dp => dp[0]),
            opens = ohlcs.map(dp => dp[1]),
            highs = ohlcs.map(dp => dp[2]),
            lows  = ohlcs.map(dp => dp[3]),
            closes = ohlcs.map(dp => dp[4]),
            rsi = utils.calculateRsi(dates, closes, 100),
            psar = utils.calculatePSar(dates, highs, lows, 100),
            bband = utils.calculateBollingerBand(dates, closes, 100)
            // ema = utils.calculateEMA(dates, closes, 100),
            // ichimokuCloud = utils.calculateIchimokuClouds(dates, highs, lows, closes, parseInt(key))
        console.log('calculations made')
        return {
          timeframe: key,
          dates: dates,
          prices: ohlcs,
          rsi: rsi,
          psar: psar,
          bband: bband,
          // ema: ema,
          // ichimokuCloud: ichimokuCloud,
        }
      })

      windows = windows.map(dp => {
        return [dp.timeframe, dp]
      })


      res.json({
        windows: Object.fromEntries(windows)
      })
  		//=> '<!doctype html> ...'
  	} catch (error) {
  		console.log(error.response.body);
  		//=> 'Internal server error ...'
  	}
  })();
});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.use(express.static(path.join(__dirname, "client", "build")))
// app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build','index.html'))
});

app.listen(port, () => console.log(`Listening on port ${port}`));
