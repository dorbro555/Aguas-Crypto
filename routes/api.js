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
            alertsLong = []
        windows = windows.map(dp => {
          return [dp.timeframe, dp]
        })
        // scanning for crossvers and storing results in redis
        var watchlist = utils.populateWatchlist(Object.fromEntries(windows))
        watchlist.forEach(scan => {
          let redisLongKey = 'wl:' + scan.type + ':long'
              redisShortKey = 'wl:' + scan.type + ':short'
          scan.crossovers.forEach(crossover => {
            let valueString = req.params.pair + ':' + scan.window + ':' + scan.type + ':' + crossover.x
            client.zadd((crossover.color === utils.longColor ? redisLongKey : redisShortKey), crossover.x, valueString)
          })
        })
        // we call the redis client for scans stored as strings, which we tokenize
        // to create and return and array of alert objects
        alertsLong = await client.zrevrange('wl:ema21over50:long', 0, 100).then((res) => {
          var alertsList = []
          res.forEach(str => {
            var tokens = str.split(':')
            alertsList.push({asset: tokens[0], tf: tokens[1], scan: tokens[2], time: parseInt(tokens[3])})
          })
          // console.log(alertsList.filter(alert => alert.asset === 'eth'))
          return alertsList
        })

        res.json({
          windows: Object.fromEntries(windows),
          alerts: alertsLong,
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
