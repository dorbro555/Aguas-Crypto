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

function calculateIchimokuClouds(dps, range){
  if (dps === undefined || dps.length == 0) return null

  let highs = dps.map((dataPoint) => {if(!dataPoint.y) return null; else return dataPoint.y[1]}),
      lows = dps.map((dataPoint) => {if(!dataPoint.y) return null; else return dataPoint.y[2]}),
      closes = dps.map((dataPoint) => {if(!dataPoint.y) return null; else return dataPoint.y[3]}),
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


  results = results.map((dp, idx) => {
    let price_displacement=idx+spanPeriod+displacement-1
    return {
      x: dps[price_displacement].x,
      action: closes[price_displacement],
      senkou: dp.spanA >= dp.spanB ? [dp.spanA, dp.spanB] : null,
      redSenkou: dp.spanB > dp.spanA ? [dp.spanA , dp.spanB]:null,
      senkouIndicator: dp.spanA >= dp.spanB ? 'green' : 'red',
      cloudActionIndicator:  cloudActionIndicatorHelper(closes[price_displacement], dp.spanA, dp.spanB),
      xBase: dps[idx+spanPeriod-2].x,
      base: dp.base,
      conversion: dp.conversion,
      xSenkouIndicator: dps[price_displacement-displacement].x,
      tkIndicator: dp.conversion > dp.base ? 'green' : 'red',
      KenBaseIndicator: closes[price_displacement-displacement-1] > dp.base ? 'green' : 'red',
    }})
  let chikou = closes.slice(range, -displacement)
                     .map((dp, i) => {
                       if(!dp) return null;
                       else return {
                         x: dps[i+spanPeriod+displacement-3].x,
                         xChikouIndicator: dps[i+spanPeriod+basePeriod+displacement-4].x,
                         y: dp,
                       }})

  return {
    senkou: results.map(dp => {return {x: dp.x, y: dp.senkou}}),
    redSenkou: results.map(dp => {return {x: dp.x, y: dp.redSenkou}}),
    baseLine: results.slice(displacement+1).map(dp => {return {x: dp.xBase, y: dp.base}}),
    conversionLine: results.slice(displacement+1).map(dp => {return {x: dp.xBase, y: dp.conversion}}),
    chikou: chikou,
    senkouIndicator: results.map(dp => {return {x: dp.xSenkouIndicator, y: 1, color: dp.senkouIndicator}}).slice(displacement),
    tkIndicator: results.slice(displacement+1).map(dp => {return {x: dp.xBase, y: 1, color: dp.tkIndicator}}),
    actionBaseLineIndicator: results.slice(displacement+2).map(dp => {return {x:dp.xBase, y: 1, color: dp.KenBaseIndicator}}),
    cloudActionIndicator: results.slice(1).map((dp, i)=> {return {x: dp.x, y: dp.cloudActionIndicator.val, color:dp.cloudActionIndicator.color, dp:dp.cloudActionIndicator}}).slice(0,-displacement),
    chikouActionIndicator: chikou.map((dp, i) => {return {x: dp.xChikouIndicator, y: 1, color: (dp.y > closes[i+range-displacement] ? 'green': 'red')}}),
  }
}

function cloudActionIndicatorHelper(price, spanA, spanB){
  if(price > Math.max(spanA, spanB)) return {val: 1, color: 'green'}
  else if(price < Math.min(spanB, spanA)) return {val: 1, color: 'red'}
  else return {val: 0, color: ''}
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
