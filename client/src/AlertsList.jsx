import {formateTimeFrame} from './utils'
import React, { useState } from 'react'

const AlertsList = ({alerts, close, isMobile}) => {
  const [showLong, setShowLong] = useState(true)

  return(
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

      <div className='buttons are-small mb-1'>
        <div className='button is-success' onClick={() => {setShowLong(true)}}>
          long
        </div>
        <div className='button is-danger' onClick={() => {setShowLong(false)}}>
          short
        </div>
      </div>

    {(showLong ? alerts.alertsLong : alerts.alertsShort).map((alert, idx) => {
      return(
        <div className='column is-12'>
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
