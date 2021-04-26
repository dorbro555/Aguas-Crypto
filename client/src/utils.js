import {SMA, RSI, IchimokuCloud, BollingerBands} from 'technicalindicators' ;

const green = '#07df3d'
const red = '#f00000'

function calculateSMA(dps, period){
  if(dps === undefined || dps.length == 0) return null
  period = period || 15

  let results = [],
      closes = dps.map((dataPoint) => {
        if(!dataPoint.y) return null
        return dataPoint.y[3]
      }),
      rawResults = SMA.calculate({period : period, values : closes}),
      nullArray = []
  for(var j = 0; j < period; j++){
    nullArray.push({
      x: dps[j].x,
      y: null
    })
  }
  results = rawResults.map((avg, i) => {
    if(!dps[i+period-1].y){
      return {
        x: dps[i+period-1].x,
        y: null
      }
    }else{
      return {
        x: dps[i+period-1].x,
        y: avg
      }
    }
  })
  return nullArray.concat(results)
}

function calculateIchimokuClouds(dps, interval){
  let highs = dps.map(dp => {return dp.y[1]}),
      lows = dps.map(dp => {return dp.y[2]}),
      closes = dps.map(dp => {return dp.y[3]}),
      conversionPeriod = 9,
      basePeriod = 26,
      spanPeriod = 52,
      displacement = 26

  var results = IchimokuCloud.calculate({high: highs,
                                         low: lows,
                                         conversionPeriod,
                                         basePeriod,
                                         spanPeriod,
                                         displacement})

  let futureTimes = calculateIchimokuTimes(dps[dps.length-1].x.getTime(), interval),
      spanDisplacement = spanPeriod + (spanPeriod/2) - 2
  results = results.map((dp, idx) => {
    return {
      x: {
        senkou: (idx < dps.length-spanDisplacement) ? dps[idx+spanDisplacement].x : new Date(futureTimes[idx-(dps.length-spanDisplacement)]),
        tk: (idx < dps.length-spanPeriod+1) ? dps[idx+spanPeriod-2].x : null,
      },
      y: dp,
      greenCloud: dp.spanA >= dp.spanB ? [dp.spanA, dp.spanB] : null,
      redCloud: dp.spanB > dp.spanA ? [dp.spanA , dp.spanB]:null,
      cloudIndicator: dp.spanA >= dp.spanB ? green : red,
      cloudActionIndicator: cloudActionIndicatorHelper(closes[idx+spanDisplacement+1], dp.spanA, dp.spanB),
      price: closes[idx+spanDisplacement+1],
      chikou: closes[idx+spanPeriod-2],
      baseLine: dp.base,
      conversionLine: dp.conversion,
      tkCrossIndicator: dp.conversion > dp.base ? green : red,
      chikouActionIndicator: closes[idx+spanDisplacement+1] > closes[idx+spanDisplacement-displacement+1] ? green : red,
      actionBaseLineIndicator: closes[idx+spanDisplacement-displacement+1] > dp.base ? green : red,
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
    chikouActionIndicator: results.slice(basePeriod+2, -displacement).map(dp => {return {x: dp.x.tk, y: 1, color: dp.chikouActionIndicator}}) ,
    actionBaseLineIndicator: results.slice(basePeriod+2).map(dp => {return {x: dp.x.tk, y: 1, color: dp.actionBaseLineIndicator}}),
    price: results.map(dp => {return {x: dp.x.senkou, y: dp.price}})
  }
}

function cloudActionIndicatorHelper(price, spanA, spanB){
  if(price > Math.max(spanA, spanB)) return {val: 1, color: green}
  else if(price < Math.min(spanB, spanA)) return {val: 1, color: red}
  else return {val: 0, color: ''}
}

function calculateBBand(prices){
  let closes = prices.map(dp => dp.y[3]),
      period = 20,
      stdDev = 2,
      results = BollingerBands.calculate({
                            period: period,
                            values: closes,
                            stdDev: stdDev,
  })
  results = results.map((dp, idx) => {
    return {
      x: prices[idx+period-1].x,
      bandValues: [dp.upper, dp.lower],
      sma: dp.middle,
      // color: "",
    }
  })

  return {
    bands: results.map(dp => {return {x: dp.x, y: dp.bandValues}}),
    sma: results.map(dp =>{return {x: dp.x, y: dp.sma}}),
  }
}

function calculateFutureDates(recentDate, timeframe, period){
  if(recentDate === undefined || timeframe === undefined) return null
  period = period || 26
  let newDates = []
  for(var i = 0; i < period; i++) {
    recentDate += (timeframe*1000)
    newDates.push(recentDate)
  }
  // console.log(newDates.map((date, i) => {
  //   return {
  //     x: new Date(date),
  //     y: null
  //   }
  // }))
  return newDates.map((date, i) => {
    return {
      x: new Date(date),
      y: null
    }
  })
}

function calculateIchimokuTimes(startTime, interval, ichimokuPeriod, range){
  if(startTime === undefined || interval === undefined) return null
  ichimokuPeriod = ichimokuPeriod || 26
  range = range || 100
  let futureTimes = []
  for(var i = 0; i < ichimokuPeriod; i++){
    startTime += (interval*1000)
    futureTimes.push(startTime)
  }

  return futureTimes
}

function formateTimeFrame(seconds){
  let newTime = seconds /60,
      unit = ' mins'
  if (newTime > 360) {newTime /= 60; unit = ' hours'}
  return newTime + unit
}

export {calculateSMA, calculateBBand, calculateFutureDates, formateTimeFrame, calculateIchimokuClouds}
