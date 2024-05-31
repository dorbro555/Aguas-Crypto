import React, { useState } from 'react'
import Alert from './Alert'
import {formateTimeFrame} from './utils'

const AlertsList = ({alerts, close, onClick}) => {
  const scanTypes = ['ema21/ema50', 'ema50/ema100', 'ema21/ema200', 'Price/ema200']
  const rangeTypes = ['volatile', 'short', 'intermediary', 'long', 'all']
  let alertFilter = (alerts) => {
        let assets = new Map(),
            ema21over50 = alerts.map(scan => {
              assets.has(scan.asset)
                ? assets.set(scan.asset, assets.get(scan.asset).concat([scan]))
                : assets.set(scan.asset, [scan])
            })
        return assets
      },
      ema21over50 = [...alertFilter(alerts['wl:ema21over50']).values()],
      ema50over100 = [...alertFilter(alerts['wl:ema50over100']).values()],
      ema21over200 = [...alertFilter(alerts['wl:ema21over200']).values()],
      priceOver200 = [...alertFilter(alerts['wl:priceOver200']).values()],
      scanMap = {
        'ema21/ema50': ema21over50,
        'ema50/ema100': ema50over100,
        'ema21/ema200': ema21over200,
        'Price/ema200': priceOver200,
      }
  const [currentScan, setCurrentScan] = useState(ema21over50)
  const [range, setRange] = useState('all')
  return(
    !!alerts &&
    <div className='alert-list columns is-multiline is-gapless'>
      <div className='column is-12 has-background-dark'>
        <div className='level is-mobile mx-2'>
          <div className='level-left'>
            <div className='level-item'>
              <h4 className='title is-4 has-text-white is-unselectable'>Alerts</h4>
            </div>
          </div>
          <div className='level-right'>
            <div className='level-item'>
              <span className='icon is-clickable' onClick={close}>
                <i className="fas fa-window-close has-text-white is-size-4 mt-1"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='column is-12 has-background-dark'>
        {scanTypes.map((scan, idx) => {
          return  <div className='' key={idx}>
                    <label className='checkbox has-text-white is-size-7 is-unselectable'
                           onClick={() => setCurrentScan(scanMap[scan])}>
                      <input type='checkbox'></input>
                      {scan}
                    </label>
                  </div>
          })}
      </div>

    {currentScan.map((alerts, idx) => {
      return(
        <Alert alerts={alerts} onClick={onClick} key={idx}/>
      )
    })}
  </div>
  )
}

export default AlertsList
