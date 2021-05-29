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
        const response = await got(`https://api.cryptowat.ch/markets/kraken/${req.params.pair}usd/ohlc?apikey=${process.env.API_KEY}`);
        let candles = JSON.parse(response.body),
            results = candles.result
            windows = utils.parseMarketData(results)
            alertsLong = []
        windows = windows.map(dp => {
          return [dp.timeframe, dp]
        })
        // scanning for crossvers and storing results in redis
        var watchlist = utils.populateWatchlist(Object.fromEntries(windows))
        watchlist.forEach(scan => {
          let redisKey = 'wl:' + scan.type
          scan.crossovers.forEach(crossover => {
            let valueString = req.params.pair + ':' + scan.window + ':' + scan.type + ':' + crossover.x + ':' + (crossover.color === utils.longColor ? 'long' : 'short')
            client.zadd(redisKey, crossover.x, valueString)
          })
        })
        // we call the redis client for scans stored as strings, which we tokenize
        // to create and return and array of alert objects
        const scanTypes = ['wl:ema21over50', 'wl:ema50over100', 'wl:ema21over200', 'wl:priceOver200']

        const scans = await Promise.all(scanTypes.map(async (scan) => {
          var alertsList = await client.zrevrange(scan, 0, 100).then(res => {
            return res.map(str => {
              var tokens = str.split(':')
              return {asset: tokens[0], tf: tokens[1], scan: tokens[2], time: parseInt(tokens[3]), position: tokens[4]}
            })
          })
          return [scan, alertsList]
        }))

        res.json({
          windows: Object.fromEntries(windows),
          alerts: Object.fromEntries(scans),
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
