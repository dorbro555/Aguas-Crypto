import React, { useState } from 'react'
import {formateTimeFrame} from './utils'

const AlertAssetPage = ({assets, close, back}) => {
  console.log(assets)
  return(
    !!assets &&
    <div>
      <div className='column is-12 has-background-dark'>
        <div className='level is-mobile mx-2'>
          <div className='level-left'>
            <div className='level-item'>
              <span className='icon is-clickable' onClick={back}>
                <i className="fas fa-chevron-left has-text-white is-size-4 mr-1"></i>
              </span>
              <h4 className='title is-4 has-text-white is-unselectable'>Alerts</h4>
            </div>
          </div>
          <div className='level-right'>
            <div className='level-item'>
              <span className='icon is-clickable' onClick={close}>
                <i class="fas fa-times has-text-white is-size-4 mt-1"></i>
              </span>
            </div>
          </div>
        </div>
        <div className='title has-text-white'>{assets[0].asset.toUpperCase()}</div>

        <div className='asset-alerts-list'>
          {assets.map((asset, idx) =>
            <div className={`alert card has-background-dark has-text-${asset.position==='long'?'success':'danger'} is-unselectable`} key={idx}>
              <div className='card-content'>
                <div className='media my-0'>
                  <div className='media-content'>
                    <div className='level has-text-weight-semibold'>
                      <div className='level-right'>
                        <time className='level-item is-size-7'>
                          {new Date(asset.time).toLocaleString('en-US')}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='level'>
                  <div className='level-left'>
                    <div className='level-item is-size-7'>
                      {asset.scan} [{formateTimeFrame(asset.tf)}]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default AlertAssetPage
