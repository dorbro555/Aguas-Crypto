const got = require('got');
const utils = require('../utils/utils');
require('dotenv').config()

const { RESTClient } = require('cw-sdk-node')
const cwClient = new RESTClient({
  creds: {
    apiKey: process.env.API_KEY // your cw api key
  }
});
const Redis = require('ioredis')
const client = new Redis({
  port: process.env.DB_PORT,
  password: process.env.DB_PASS
})

let analyzeMarket = async (asset) => {
  try {
    const response = await got(`https://api.cryptowat.ch/markets/kraken/${asset}usd/ohlc`);
    // const response = await cwClient.getOHLC('kraken', `${asset}usd`)
    let candles = JSON.parse(response.body),
        results = candles.result
        windows = utils.parseMarketData(results)
<<<<<<< HEAD
=======
        windows = utils.parseMarketData(response)
>>>>>>> dad0a2a1bb169ced412b3ddfdf54f2f9bc9e0848
        alertsLong = []
    windows = windows.map(dp => {
      return [dp.timeframe, dp]
    })

    // scanning for crossvers and storing results in redis
    var watchlist = utils.populateWatchlist(Object.fromEntries(windows))
    watchlist.forEach(scan => {
        let redisKey = 'wl:' + scan.type
        scan.crossovers.forEach(async crossover => {
            let valueString = asset + ':' + scan.window + ':' + scan.type + ':' + crossover.x + ':' + (crossover.color === utils.longColor ? 'long' : 'short')
            //run redis sorted set add
            await client.zadd(redisKey, crossover.x, valueString)
      })
    })
    console.log('ok')
  } catch(err) {
    console.error(`error:  ${err.message}\n${err.stack}`)
    return {}
  }
  return JSON.stringify(watchlist)
}
  const assets = [
    'btc','eth',
    'bch', 'ada','link','dash','eos',
    'ltc','dot','xtz','trx','algo','atom'
              ]

//Begin runtime
//declare an asynchronous arrow function to analyze the market, and run it
;(async () => {
  Promise.all(assets.map(asset => {
    console.log('now scanning ' + asset + '...')
    console.log(analyzeMarket(asset))
  }))
})()
process.on('exit', function(code) {
    return console.log(`About to exit with code ${code}`);
});

module.exports.analyzeMarket = analyzeMarket
