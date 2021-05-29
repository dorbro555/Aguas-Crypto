import React, { useState } from 'react'
import Alert from './Alert'
import {formateTimeFrame} from './utils'

const AlertsList = ({alerts, close, isMobile, onClick}) => {
  const [showLong, setShowLong] = useState(true)
  const scanTypes = ['ema21/ema50', 'ema50/ema100', 'ema21/ema200', 'Price/ema200']
  const rangeTypes = ['volatile', 'short', 'intermediary', 'long', 'all']
  let ema21over50Long = alerts['wl:ema21over50'].filter(scan => scan.position === 'long'),
      ema21over50Short = alerts['wl:ema21over50'].filter(scan => scan.position === 'short'),
      ema50over100Long= alerts['wl:ema50over100'].filter(scan => scan.position === 'long'),
      ema50over100Short = alerts['wl:ema50over100'].filter(scan => scan.position === 'short'),
      ema21over200Long = alerts['wl:ema21over200'].filter(scan => scan.position === 'long'),
      ema21over200Short = alerts['wl:ema21over200'].filter(scan => scan.position === 'short'),
      PriceOver200Long = alerts['wl:priceOver200'].filter(scan => scan.position === 'long'),
      PriceOver200Short = alerts['wl:priceOver200'].filter(scan => scan.position === 'short'),
      scanMap = {
        'ema21/ema50': [ema21over50Long,ema21over50Short],
        'ema50/ema100': [ema50over100Long,ema50over100Short],
        'ema21/ema200': [ema21over200Long,ema21over200Short],
        'Price/ema200': [PriceOver200Long,PriceOver200Short],
      }
  const [currentScan, setCurrentScan] = useState([ema21over50Long,ema21over50Short])
  const [range, setRange] = useState('all')
  const [scans, setScans] = useState({
    'ema21/ema50' : ema21over50Long
  })

  return(
    !!alerts &&
    <div className={'alert-list columns is-multiline is-gapless' + (isMobile ? ' is-overlay' : '')}>
      <div className='column is-12 has-background-dark'>
        <div className='level is-mobile mx-2'>
          <div className='level-left'>
            <div className='level-item'>
              <h4 className='title is-4 has-text-white'>Alerts</h4>
            </div>
          </div>
          <div className='level-right'>
            <div className='level-item'>
              <span className='icon is-clickable' onClick={close}>
                <i class="fas fa-window-close has-text-white is-size-4 mt-1"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='column is-12 has-background-dark'>
        {scanTypes.map((scan, idx) => {
          return  <div className=''>
                    <label className='checkbox has-text-white is-size-7 is-unselectable'
                           onClick={() => setCurrentScan(scanMap[scan])}>
                      <input type='checkbox'></input>
                      {scan}
                    </label>
                  </div>
          })}
      </div>

      <div className='buttons are-small mb-1 has-background-dark'>
        <div className='button is-success' onClick={() => {setShowLong(true)}}>
          long
        </div>
        <div className='button is-danger' onClick={() => {setShowLong(false)}}>
          short
        </div>
      </div>

    {(showLong ? currentScan[0] : currentScan[1]).map((alert, idx) => {
      return(
        <Alert alert={alert} onClick={onClick} isLong={showLong} />
      )
    })}
  </div>
  )
}

export default AlertsList
