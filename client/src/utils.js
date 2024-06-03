function formateTimeFrame(seconds){
  let newTime = seconds /60,
      unit = 'M'
  if (newTime > 60) {newTime /= 60; unit = 'H'}
  return newTime + unit
}

function formatTimeFrame(timeframe_name){
  let timeframe_map = {
    'oneMin': '1 Min',
    'threeMin': '3 Min',
    'fiveMin': '5 Min',
    'fifteenMin': '15 Min',
    'oneHour': '1 Hr',
  } 
  return timeframe_map[timeframe_name]
}

export {formatTimeFrame}
