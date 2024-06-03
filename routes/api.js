const express = require('express')
const router = express.Router()

require('dotenv').config()
const got = require('got');
const { spawn } = require('child_process')
const RateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
const Redis = require('ioredis')
const client = new Redis({
  port: process.env.DB_PORT,
  password: process.env.DB_PASS
})
const utils = require('../utils/utils');

//create func that returns a scan subprocess
var subprocessScan
var scanCount = 0
const createSubprocessScan = () => {
  subprocessScan = setInterval(() => {

    const child = spawn('node', ['jobs/scan.js'])
    child.stdout.on('data', data => {
      console.log(`stdout:\n${data}`);
    });

    child.stderr.on('data', data => {
      console.error(`stderr: ${data}`);
    });

    child.on('error', (error) => {
      console.error(`error: ${error.message}`);
    });

    child.on('close', (code) => {
      scanCount++;
      if(scanCount > 6){clearInterval(subprocessScan)}
      console.log(`child process exited with code ${code}`);
    });
  }, 1800000)
}

//create the rate limiter for the api route
const limiter = new RateLimit({
  store: new RedisStore({
    client: client,
    expiry: 6 *  60 * 60, // 6 hours
  }),
  max: 600, // 600 requests per window
})
// TODO reimplement rate-limiting
// router.use(limiter)

const currentDate = new Date()
const sinceDate = new Date(currentDate)
sinceDate.setDate(currentDate.getDate() - 10)

const query = `
{
  ethereum(network: ethereum) {
    oneMin: dexTrades(
      options: {limit: 100, desc: "timeInterval.minute"}
      date: {since: "${sinceDate.toISOString()}", till: "${currentDate.toISOString()}"}
      baseCurrency: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
      quoteCurrency: {is: "0xdAC17F958D2ee523a2206206994597C13D831ec7"}
    ) {
      timeInterval {
        minute(count: 1)
      }
      baseCurrency {
        symbol
      }
      quoteCurrency {
        symbol
      }
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price)
      volume: quoteAmount
    }
    threeMin: dexTrades(
      options: {limit: 100, desc: "timeInterval.minute"}
      date: {since: "${sinceDate.toISOString()}", till: "${currentDate.toISOString()}"}
      baseCurrency: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
      quoteCurrency: {is: "0xdAC17F958D2ee523a2206206994597C13D831ec7"}
    ) {
      timeInterval {
        minute(count: 3)
      }
      baseCurrency {
        symbol
      }
      quoteCurrency {
        symbol
      }
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price)
      volume: quoteAmount
    }
    fiveMin: dexTrades(
      options: {limit: 100, desc: "timeInterval.minute"}
      date: {since: "${sinceDate.toISOString()}", till: "${currentDate.toISOString()}"}
      baseCurrency: {is: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"}
      quoteCurrency: {is: "0xdAC17F958D2ee523a2206206994597C13D831ec7"}
    ) {
      timeInterval {
        minute(count: 5)
      }
      baseCurrency {
        symbol
      }
      quoteCurrency {
        symbol
      }
      high: quotePrice(calculate: maximum)
      low: quotePrice(calculate: minimum)
      open: minimum(of: block, get: quote_price)
      close: maximum(of: block, get: quote_price)
      volume: quoteAmount
    }
  }
}
`

const url = "https://graphql.bitquery.io/"
const options = {
  method: "POST",
  headers: {
    'X-API-KEY': process.env.BITQUERY_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: query
  })
}

router
  .get('/ohlc/:pair', (req, res) => {
    (async () => {
    	try {
        // const response = await got(`https://api.cryptowat.ch/markets/kraken/${req.params.pair}usd/ohlc?apikey=${process.env.API_KEY}`);
        // const response = await got(`https://api.kraken.com/0/public/OHLC?pair=${req.params.pair}usd`);
        const response = await got.post(url, options)
        // console.log(JSON.parse(response.body).data.ethereum)
        // console.log(currentDate.toISOString() + ' ' + sinceDate.toISOString())
        let candles = JSON.parse(response.body).data
            results = candles.ethereum
            windows = utils.parseMarketDataBitQuery(results)
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
          var alertsList = await client.zrevrange(scan, 0, -1).then(res => {
            return res.map(str => {
              var tokens = str.split(':')
              return {asset: tokens[0], tf: tokens[1], scan: tokens[2], time: parseInt(tokens[3]), position: tokens[4]}
            })
          })
          return [scan, alertsList]
        }))

        //make sure the subprocess is cleared
        clearInterval(subprocessScan)
        scanCount = 0
        //start the timer for the scan subprocess
        await createSubprocessScan()
        //return the response
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
  .get('/world', (req, res) => {
    console.log(req.body)
    res.send(
      `The api is up and running`
    );
  })


module.exports = router
