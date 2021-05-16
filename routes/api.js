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
        let candles = JSON.parse(response.body),
            results = candles.result
        windows = utils.parseMarketData(results)
        windows = windows.map(dp => {
          return [dp.timeframe, dp]
        })
        // windows['180'].emaIndicator.ema21over50

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
