function formateTimeFrame(seconds){
  let newTime = seconds /60,
      unit = 'M'
  if (newTime > 60) {newTime /= 60; unit = 'H'}
  return newTime + unit
}

export {formateTimeFrame}
