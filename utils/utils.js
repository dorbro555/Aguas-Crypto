const tulind = require('tulind');
const technicalindicators = require('technicalindicators');

const green = '#07df3d'
const red = '#f00000'

function parseMarketData(data){
  var windows = Object.keys(data).map((key, idx) => {
        let ohlcs = data[key],//we slice twice the range, to provide extra data that may be needed to compute more accurate results
            dates = ohlcs.map(dp => dp[0]),
            opens = ohlcs.map(dp => dp[1]),
            highs = ohlcs.map(dp => dp[2]),
            lows  = ohlcs.map(dp => dp[3]),
            closes = ohlcs.map(dp => dp[4]),
            rsi = calculateRsi(dates, closes, 100),
            psar = calculatePSar(dates, highs, lows, 100),
            bband = calculateBollingerBand(dates, closes, 100),
            [ema21, ema50, ema100, ema200] = calculateEMA([21, 50, 100, 200],dates, closes, 100),
            ichimokuCloud = calculateIchimokuClouds(dates, highs, lows, closes, parseInt(key)),
            [conversionLinePercent, baseLinePercent, ichimokuSpanAPercent, ichimokuSpanBPercent] = calculateBBandPercentage(bband, [ichimokuCloud.conversionLine.map(dp => dp.y),ichimokuCloud.baseLine.map(dp => dp.y),ichimokuCloud.leadingSpans.slice(0, -26).map(dp => dp.y[0]), ichimokuCloud.leadingSpans.slice(0, -26).map(dp => dp.y[1])]),
            [psarPercent] = calculateBBandPercentage(bband, [psar.values.map(dp => dp.y)]),
            [emaPercent21, emaPercent50, emaPercent100, emaPercent200] = calculateBBandPercentage(bband, [ema21.map(dp => dp.y),ema50.map(dp => dp.y),ema100.map(dp => dp.y),ema200.map(dp => dp.y)]),
            ema21over50 = calculateEMAIndicators(ema21, ema50)
            ema21over200 = calculateEMAIndicators(ema21, ema200)
            ema50over100 = calculateEMAIndicators(ema50, ema100)
            emaPriceOver200 = calculateEMAIndicators(ohlcs.map(dp => {return {x: dp[0]*1000, y: dp[4]}}).slice(-ema200.length),ema200)
            ema200Crossover = scanEmasForCrossovers(emaPriceOver200)

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
          },
          emaIndicator: {
            ema21over50: ema21over50,
            ema21over200: ema21over200,
            ema50over100: ema50over100,
            emaPriceOver200: emaPriceOver200,
          }
        }
      })

      return windows
}

function calculateRsi(dates, closes, range){
  let values = [],
      start = tulind.indicators.rsi.start([14])
      buffer = 50
  tulind.indicators.rsi.indicator([closes.slice(-(range+start+buffer))], [14], (err, results) => {
    values.push(results[0])
  })
  values = values[0].map((dp, idx) => {return {x: dates.slice(-(range+start+buffer))[idx+start-1]*1000, y: dp}})

  return {
    values: values
  }
}

function calculateCLBB(bollingerBand, conversionLine){
  let percent = bollingerBand.bands.slice(-conversionLine.length).map((dp, idx) => {
    return {
      x: dp.x,
      y: (conversionLine[idx].y-dp.y[0])/(dp.y[1]-dp.y[0])*100
    }
  })

  return percent
}

function calculateBLBB(bollingerBand, baseLine){
  let percent = bollingerBand.bands.slice(-baseLine.length).map((dp, idx) => {
    return {
      x: dp.x,
      y: (baseLine[idx].y-dp.y[0])/(dp.y[1]-dp.y[0])*100
    }
  })

  return percent
}

function calculateBBandPercentage(bollingerBand, data){
  let percentages = []

  data.forEach(val => {
    let percent = bollingerBand.bands.slice(-val.length).map((dp, idx) => {
      return {
        x: dp.x,
        y: (val[idx]-dp.y[0])/(dp.y[1]-dp.y[0])*100
      }
    })
    percentages.push(percent)
  })


  return percentages
}

function calculatePSar(dates, highs, lows, range){
  let start = tulind.indicators.psar.start([0.025, 0.25])
      values = [],
      results = [],
      preciseDates = dates.slice(-(range+start)),
      preciseHighs = highs.slice(-(range+start)),
      preciseLows = lows.slice(-(range+start))

  tulind.indicators.psar.indicator([preciseHighs, preciseLows], [0.025, 0.25], (err, results) => {
    values = values.concat(results[0])
  })
  results = values.map((dp, idx) => {return {x: preciseDates[idx+start]*1000,
                                             y: dp,
                                             actionIndicator: dp < preciseHighs[idx+start-1] ? green : red}})


  return {
    values: results.map(dp => {return {x: dp.x, y: dp.y}}),
    actionIndicator: results.map(dp => {return {x: dp.x, y: 1, color: dp.actionIndicator}})
  }
}

function calculateBollingerBand(dates, closes, range){
  let period = 20,
      stdDev = 2,
      start = tulind.indicators.bbands.start([period, stdDev]),
      preciseDates = dates.slice(-(range+start))
      preciseCloses = closes.slice(-(range+start))
      bands = [],
      sma = [],
      percent = []

  tulind.indicators.bbands.indicator([preciseCloses], [period, stdDev], (err, results) => {
    bands = results[0].map((dp, idx) => {return {x: preciseDates[idx+start]*1000, y: [dp, results[2][idx]]}})
    sma = results[1].map((dp, idx) => {return {x: preciseDates[idx+start]*1000, y: dp}})
    percent = bands.map((dp, idx) => {return {x: dp.x, y: ((preciseCloses[idx+start]-dp.y[0])/(dp.y[1]-dp.y[0]))*100}})
  })
  // values = values.map((dp, idx) => {return {x: dates[idx+start-1], y: dp}})

  return {
    bands: bands,
    sma: sma,
    percent: percent
  }
}

function calculateEMA(periods, dates, closes, range){
  periods = periods || [21, 50, 100, 200]
  let emas = []


  periods.forEach(period => {
    let start = tulind.indicators.ema.start([period]),
        preciseDates = dates.slice(-(range+start))
        preciseCloses = closes.slice(-(range+start)),
        ema = []


    tulind.indicators.ema.indicator([closes], [period], (err, results) => {
      ema = results[0].slice(-(range+start)).map((dp, idx) => {return {x: preciseDates[idx+start]*1000, y: dp}})
    })
    emas.push(ema)
  })

  return emas
}

// compares the most recent values from both ema's
// returns true if the first value is over the second
function calculateEMAIndicatorHead(ema1, ema2){
  let ema1Head = ema1[ema1.length-1]
      ema2Head = ema2[ema2.length-1]
    if(ema1Head.y > ema2Head.y) return {x: ema1Head.x, y:1, color: green}
    else if(ema1Head.y < ema2Head.y) return {x: ema1Head.x, y: 1, color: red}
    else return {x: ema1Head.x, y: 1, color: ''}
}

//returns a list of ema comparisons
function calculateEMAIndicators(ema1, ema2){
  let results = []
  results = ema1.map((dp, idx) => {
    if(dp.y > ema2[idx].y) return {x: dp.x, y:1, color: green}
    else if(dp.y < ema2[idx].y) return {x: dp.x, y: 1, color: red}
    else return {x: dp.x, y: 1, color: ''}
  })

  return {
    head: results[results.length-1],
    values: results
  }
}
//takes an array of ema indicator results, and returns
//a list of times where crossovers occur
function scanEmasForCrossovers(emaIndicator){
  let crossoverList = []
  for(var i = 1; i < emaIndicator.length-1; i++){
    if(emaIndicator[i].color != emaIndicator[i-1].color){
      crossoverList.push(emaIndicator[i])
    }
  }
  return crossoverList
}

function populateWatchlist(marketData){
  let windows = marketData.windows
      emaList = []

  Object.keys(marketData).forEach(tf => {
    let emaIndicators = marketData[tf].emaIndicator
    Object.keys(emaIndicators).forEach(key => {
      let results = scanEmasForCrossovers(emaIndicators[key].values)
      if(results.length > 0){emaList.push({window: tf, type: key, crossovers: results})}
    })
  })



  return emaList
}

function calculateIchimokuClouds(dates, highs, lows, closes, interval){
  let conversionPeriod = 9,
      basePeriod = 26,
      spanPeriod = 52,
      displacement = 26,
      range = 60,
      start = spanPeriod+displacement,
      preciseCloses = closes.slice(-(range+start)),
      preciseHighs = highs.slice(-(range+start)),
      preciseLows = lows.slice(-(range+start)),
      preciseDates = dates.slice(-(range+start))

  var results = technicalindicators.IchimokuCloud.calculate({high: preciseHighs,
                                         low: preciseLows,
                                         conversionPeriod,
                                         basePeriod,
                                         spanPeriod,
                                         displacement})

  let futureTimes = calculateIchimokuTimes(preciseDates[preciseDates.length-1], interval),
      spanDisplacement = spanPeriod + (spanPeriod/2) - 2
  results = results.map((dp, idx) => {
    return {
      x: {
        senkou: (idx < preciseDates.length-spanDisplacement) ? preciseDates[idx+spanDisplacement]*1000 : futureTimes[idx-(preciseDates.length-spanDisplacement)]*1000,
        tk: (idx < preciseDates.length-spanPeriod+1) ? preciseDates[idx+spanPeriod-1]*1000 : null,
      },
      y: dp,
      leadingSpans: [dp.spanA, dp.spanB],
      greenCloud: dp.spanA >= dp.spanB ? [dp.spanA, dp.spanB] : null,
      redCloud: dp.spanB > dp.spanA ? [dp.spanA , dp.spanB]:null,
      cloudIndicator: dp.spanA >= dp.spanB ? green : red,
      cloudActionIndicator: cloudActionIndicatorHelper(preciseCloses[idx+spanDisplacement+1], dp.spanA, dp.spanB),
      price: preciseCloses[idx+spanDisplacement+1],
      chikou: preciseCloses[idx+spanPeriod-2],
      baseLine: dp.base,
      conversionLine: dp.conversion,
      tkCrossIndicator: dp.conversion > dp.base ? green : red,
      chikouActionIndicator: preciseCloses[idx+spanDisplacement+1] > preciseCloses[idx+spanDisplacement-displacement+1] ? green : red,
      actionBaseLineIndicator: preciseCloses[idx+spanDisplacement-displacement+1] > dp.base ? green : red,
    }
  })

  return {
    leadingSpans: results.map(dp => {return {x: dp.x.senkou, y: dp.leadingSpans}}),
    greenCloud: results.map(dp => {return {x: dp.x.senkou, y: dp.greenCloud}}),
    redCloud: results.map(dp => {return {x: dp.x.senkou, y: dp.redCloud}}),
    baseLine: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: dp.baseLine}}),
    conversionLine: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: dp.conversionLine}}),
    cloudIndicator: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: 1, color: dp.cloudIndicator}}),
    cloudActionIndicator: results.slice(0, -basePeriod).map(dp => {return {x: dp.x.senkou, y: dp.cloudActionIndicator.val, color: dp.cloudActionIndicator.color}}),
    tkCrossIndicator: results.slice(basePeriod+2).map(dp => {return {x:dp.x.tk, y:1, color: dp.tkCrossIndicator}}),
    laggingSpan: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: dp.price}}),
    chikouActionIndicator: results.slice(0, -displacement).map(dp => {return {x: dp.x.senkou, y: 1, color: dp.chikouActionIndicator}}) ,
    actionBaseLineIndicator: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: 1, color: dp.actionBaseLineIndicator}}),
    price: results.map(dp => {return {x: dp.x.senkou, y: dp.price}})
  }
}

function cloudActionIndicatorHelper(price, spanA, spanB){
  if(price > Math.max(spanA, spanB)) return {val: 1, color: green}
  else if(price < Math.min(spanB, spanA)) return {val: 1, color: red}
  else return {val: 0, color: ''}
}

function calculateIchimokuTimes(startTime, interval, ichimokuPeriod, range){
  if(startTime === undefined || interval === undefined) return null
  ichimokuPeriod = ichimokuPeriod || 26
  range = range || 100
  let futureTimes = []
  for(var i = 0; i < ichimokuPeriod; i++){
    startTime += interval
    futureTimes.push(startTime)
  }

  return futureTimes
}


module.exports = {
  calculateRsi: calculateRsi,
  calculatePSar: calculatePSar,
  calculateBollingerBand: calculateBollingerBand,
  calculateEMA: calculateEMA,
  calculateIchimokuClouds: calculateIchimokuClouds,
  calculateBBandPercentage: calculateBBandPercentage,
  calculateEMAIndicatorHead: calculateEMAIndicatorHead,
  parseMarketData:parseMarketData,
  populateWatchlist: populateWatchlist,
  longColor: green
}
