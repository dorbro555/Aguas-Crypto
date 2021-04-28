const tulind = require('tulind');
const technicalindicators = require('technicalindicators');

const green = '#07df3d'
const red = '#f00000'

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
      values = [],
      results = [],
      preciseDates = dates.slice(-(range+start)),
      preciseHighs = highs.slice(-(range+start)),
      preciseLows = lows.slice(-(range+start))

  tulind.indicators.psar.indicator([preciseHighs, preciseLows], [0.025, 0.25], (err, results) => {
    values = values.concat(results[0])
  })
  results = values.map((dp, idx) => {return {x: preciseDates[idx+start-1],
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
    bands = results[0].map((dp, idx) => {return {x: preciseDates[idx+start], y: [dp, results[2][idx]]}})
    sma = results[1].map((dp, idx) => {return {x: preciseDates[idx+start], y: dp}})
    percent = bands.map((dp, idx) => {return {x: dp.x, y: ((preciseCloses[idx+start]-dp.y[0])/(dp.y[1]-dp.y[0]))*100, lineColor: '#6272a4'}})
  })
  // values = values.map((dp, idx) => {return {x: dates[idx+start-1], y: dp}})

  return {
    bands: bands,
    sma: sma,
    percent: percent
  }
}

function calculateEMA(dates, closes, range){
  let period = 200,
      start = tulind.indicators.ema.start([period]),
      preciseDates = dates.slice(-(range+start))
      preciseCloses = closes.slice(-(range+start)),
      ema = []

  tulind.indicators.ema.indicator([preciseCloses], [period], (err, results) => {
    ema = results[0].map((dp, idx) => {return {x: preciseDates[idx+start], y: dp}})
  })

  return {
    values : ema
  }
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
        senkou: (idx < preciseDates.length-spanDisplacement) ? preciseDates[idx+spanDisplacement] : futureTimes[idx-(preciseDates.length-spanDisplacement)],
        tk: (idx < preciseDates.length-spanPeriod+1) ? preciseDates[idx+spanPeriod-2] : null,
      },
      y: dp,
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
    greenCloud:results.map(dp => {return {x: dp.x.senkou, y: dp.greenCloud}}),
    redCloud: results.map(dp => {return {x: dp.x.senkou, y: dp.redCloud}}),
    baseLine: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: dp.baseLine}}),
    conversionLine: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: dp.conversionLine}}),
    cloudIndicator: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: 1, color: dp.cloudIndicator}}),
    cloudActionIndicator: results.map(dp => {return {x: dp.x.senkou, y: dp.cloudActionIndicator.val, color: dp.cloudActionIndicator.color}}),
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
}
