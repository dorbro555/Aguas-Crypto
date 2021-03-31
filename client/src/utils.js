import {SMA, RSI, IchimokuCloud} from 'technicalindicators' ;

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

function calculateRSI(dps, period){
  if(dps === undefined || dps.length == 0) return null
  period = period || 14

  let results = [],
      closes = dps.map((datapoint) => datapoint.y[3]),
      rsiResults = RSI.calculate({period: period, values: closes})

  console.log(rsiResults)
  return null
}

function calculateIchimokuClouds(dps, period){
  if (dps === undefined || dps.length == 0) return null
  period = period || 3600

  let highs = dps.map((dataPoint) => {if(!dataPoint.y) return null; else return dataPoint.y[1]}),
      lows = dps.map((dataPoint) => {if(!dataPoint.y) return null; else return dataPoint.y[2]}),
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
                              .slice(0, -displacement)
  console.log(results)
  results = results.map((dp, idx) => {return {
    x: dps[idx+spanPeriod+displacement-1].x,
    y: [dp.spanB, dp.spanA]
  }})
  //add data points that are placed (displacement) in future
  // for(var j = 0; j < displacement; j++){
  //   results.push({
  //     x: new Date(dps[dps.length-1].valueOf + (window * 1000)),
  //     y:
  //   })
  // }
  return results
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

export {calculateSMA, calculateRSI, calculateIchimokuClouds, calculateFutureDates}
