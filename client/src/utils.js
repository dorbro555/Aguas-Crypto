function formateTimeFrame(seconds){
  let newTime = seconds /60,
      unit = ' mins'
  if (newTime > 60) {newTime /= 60; unit = ' hours'}
  return newTime + unit
}

export {formateTimeFrame}
