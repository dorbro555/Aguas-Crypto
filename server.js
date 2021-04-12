const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const { RESTClient } = require('cw-sdk-node')
const axios = require('axios')
const tulind = require('tulind');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new RESTClient({
  creds: {
    apiKey: "NPB0Z2I1QFUJQZ7JYA0C" // your cw api key
  }
});

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/exchanges', (req, res) => {
  client.getExchanges()
  .then((exchanges) => {
    res.send({ exchanges })
  })
});

app.get('/api/ohlc/:pair', (req, res) => {
  axios.get(`https://api.cryptowat.ch/markets/kraken/${req.params.pair}usd/ohlc`)
  .then(res => res.data)
  .then((candles) => {
    let results = candles.result

    windows = Object.keys(results).map((key, idx) => {
      let ohlcs = results[key],
          dates = ohlcs.map(dp => dp[0]),
          opens = ohlcs.map(dp => dp[1]),
          highs = ohlcs.map(dp => dp[2]),
          lows  = ohlcs.map(dp => dp[3]),
          closes = ohlcs.map(dp => dp[4]),
          rsi = calculateRsi(dates, closes, 100),
          psar = calculatePSar(dates, highs, lows, 100)
          bband = calculateBollingerBand(dates, closes, 100)
      return {
        timeframe: key,
        dates: dates,
        prices: ohlcs,
        rsi: rsi,
        psar: psar,
        bband: bband,
      }
    })

    windows = windows.map(dp => {
      return [dp.timeframe, dp]
    })

    res.json({
      windows: Object.fromEntries(windows)
    })
  })
});

function calculateRsi(dates, closes, range){
  let values = [],
      start = tulind.indicators.rsi.start([14])
      buffer = 50
  tulind.indicators.rsi.indicator([closes.slice(-(range+start+buffer))], [14], (err, results) => {
    values.push(results[0])
  })
  values = values[0].map((dp, idx) => {return {x: dates.slice(-(range+start+buffer))[idx+start-1], y: dp}})

  return {
    values: values
  }
}

function calculatePSar(dates, highs, lows, range){
  let start = tulind.indicators.psar.start([0.025, 0.25])
      values = []

  tulind.indicators.psar.indicator([highs, lows], [0.025, 0.25], (err, results) => {
    values = values.concat(results[0])
  })
  values = values.map((dp, idx) => {return {x: dates[idx+start-1], y: dp}})

  return {
    values: values
  }
}

function calculateBollingerBand(dates, closes, range){
  let period = 20,
      stdDev = 2,
      start = tulind.indicators.bbands.start([period, stdDev]),
      preciseDates = dates.slice(-(range+start))
      preciseCloses = closes.slice(-(range+start))
      bands = [],
      sma = []

  tulind.indicators.bbands.indicator([preciseCloses], [period, stdDev], (err, results) => {
    bands = results[0].map((dp, idx) => {return {x: preciseDates[idx+start], y: [dp, results[2][idx]]}})
    sma = results[1].map((dp, idx) => {return {x: preciseDates[idx+start], y: dp}})
  })
  // values = values.map((dp, idx) => {return {x: dates[idx+start-1], y: dp}})

  return {
    bands: bands,
    sma: sma
  }
}

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
