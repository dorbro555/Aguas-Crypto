import {formateTimeFrame} from './utils'
import React, { useState } from 'react'

const AlertsList = ({alerts, close, isMobile}) => {
  const [showLong, setShowLong] = useState(true)
  const scanTypes = ['ema21/ema50', 'ema50/ema100', 'ema21/ema200', 'Price/ema200']
  let ema21over50Long = alerts['wl:ema21over50'].filter(scan => scan.position === 'long'),
      ema21over50Short = alerts['wl:ema21over50'].filter(scan => scan.position === 'short'),
      ema50over100Long= alerts['wl:ema50over100'].filter(scan => scan.position === 'long'),
      ema50over100Short = alerts['wl:ema50over100'].filter(scan => scan.position === 'short'),
      ema21over200Long = alerts['wl:ema21over200'].filter(scan => scan.position === 'long'),
      ema21over200Short = alerts['wl:ema21over200'].filter(scan => scan.position === 'short'),
      emaPriceOver200Short = alerts['wl:emaPriceOver200'].filter(scan => scan.position === 'long'),
      emaPriceOver200Long = alerts['wl:emaPriceOver200'].filter(scan => scan.position === 'short'),
      scanMap = {
        'ema21/ema50': [ema21over50Long,ema21over50Short],
        'ema50/ema100': [ema50over100Long,ema50over100Short],
        'ema21/ema200': [ema21over200Long,ema21over200Short],
        'Price/ema200': [emaPriceOver200Long,emaPriceOver200Short],
      }
  const [currentScan, setCurrentScan] = useState([ema21over50Long,ema21over50Short])
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
            <div classNam='level-item'>
              <span className='icon is-clickable' onClick={close}>
                <i class="fas fa-window-close has-text-white"></i>
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
        <div className='alert column is-12'>
        <div className={`card has-background-${showLong?'success':'danger'}-light has-text-${showLong?'success':'danger'}-dark is-unselectable`}>
          <div className='card-content'>
            <div className='media my-0'>
              <div className='media-content'>
                <div className='level has-text-weight-semibold'>
                  <div className='level-left'>
                    <div className='level-item'>
                      {alert.asset}
                    </div>
                  </div>
                  <div className='level-right'>
                    <time className='level-item is-size-7'>
                      {new Date(alert.time).toLocaleString('en-US')}
                    </time>
                  </div>
                </div>
              </div>
            </div>
            <div className='level'>
              <div className='level-left'>
                <div className='level-item is-size-7'>
                  {alert.scan} [{formateTimeFrame(alert.tf)}]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    })}
  </div>
  )
}

export default AlertsList
