const express = require('express')
const router = express.Router()

require('dotenv').config()
const got = require('got');
const RateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
const Redis = require('ioredis')
const client = new Redis({
  port: process.env.DB_PORT,
  password: process.env.DB_PASS
})
const utils = require('../utils/utils');

const limiter = new RateLimit({
  store: new RedisStore({
    client: client,
    expiry: 6 *  60 * 60, // 6 hours
  }),
  max: 600, // 600 requests per window
})
router.use(limiter)

router
  .get('/ohlc/:pair', (req, res) => {
    (async () => {
    	try {
    		const response = await got(`https://api.cryptowat.ch/markets/kraken/${req.params.pair}usd/ohlc`);
        let candles = JSON.parse(response.body)
        let results = candles.result
        windows = Object.keys(results).map((key, idx) => {
          let ohlcs = results[key].slice(-200),//we slice twice the range, to provide extra data that may be needed to compute more accurate results
              dates = ohlcs.map(dp => dp[0]),
              opens = ohlcs.map(dp => dp[1]),
              highs = ohlcs.map(dp => dp[2]),
              lows  = ohlcs.map(dp => dp[3]),
              closes = ohlcs.map(dp => dp[4]),
              rsi = utils.calculateRsi(dates, closes, 100),
              psar = utils.calculatePSar(dates, highs, lows, 100),
              bband = utils.calculateBollingerBand(dates, closes, 100),
              [ema21, ema50, ema100, ema200] = utils.calculateEMA([21, 50, 100, 200],dates, closes, 100),
              ichimokuCloud = utils.calculateIchimokuClouds(dates, highs, lows, closes, parseInt(key)),
              [conversionLinePercent, baseLinePercent, ichimokuSpanAPercent, ichimokuSpanBPercent] = utils.calculateBBandPercentage(bband, [ichimokuCloud.conversionLine.map(dp => dp.y),ichimokuCloud.baseLine.map(dp => dp.y),ichimokuCloud.leadingSpans.slice(0, -26).map(dp => dp.y[0]), ichimokuCloud.leadingSpans.slice(0, -26).map(dp => dp.y[1])]),
              [psarPercent] = utils.calculateBBandPercentage(bband, [psar.values.map(dp => dp.y)]),
              [emaPercent21, emaPercent50, emaPercent100, emaPercent200] = utils.calculateBBandPercentage(bband, [ema21.map(dp => dp.y),ema50.map(dp => dp.y),ema100.map(dp => dp.y),ema200.map(dp => dp.y)])


          return {
            timeframe: key,
            dates: dates,
            prices: ohlcs,
            rsi: rsi,
            psar: psar,
            bband: bband,
            ema: {
              21: ema21,
              50: ema50,
              100: ema100,
              200: ema200
            },
            ichimokuCloud: ichimokuCloud,
            percentages: {
              conversionLinePercent: conversionLinePercent,
              baseLinePercent: baseLinePercent,
              ichimokuSpanAPercent: ichimokuSpanAPercent,
              ichimokuSpanBPercent: ichimokuSpanBPercent,
              psarPercent: psarPercent,
              emaPercent21: emaPercent21,
              emaPercent50: emaPercent50,
              emaPercent100: emaPercent100,
              emaPercent200: emaPercent200,

            }
          }
        })

        windows = windows.map(dp => {
          return [dp.timeframe, dp]
        })


        res.json({
          windows: Object.fromEntries(windows),
          allowance: req.rateLimit
        })
    		//=> '<!doctype html> ...'
    	} catch (error) {
    		console.log(error);
    		//=> 'Internal server error ...'
    	}
    })();
  })
  .post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
      `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
  })


module.exports = router
