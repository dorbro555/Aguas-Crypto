import React, {Component} from 'react'

function EmaIndicator({emaIndicators}){
  return(
    <div>
      <div className='button is-black is-fullwidth'>
        <span className='mr-1'>Ema's</span>
        <div className='buttons are-small'>
          <span className={emaIndicators.emaPriceOver200.color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}>Price/200</span>
          <span className={emaIndicators.ema21over50.color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}>21/50</span>
          <span className={emaIndicators.ema50over100.color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}>50/100</span>
          <span className={emaIndicators.ema21over200.color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}>21/200</span>
        </div>
      </div>
    </div>
  )
}

export default EmaIndicator
