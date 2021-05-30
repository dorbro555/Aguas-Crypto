import React, { useState } from 'react'

const AlertAsset = ({close, back}) => {

  return(
    <div>
      <div className='column is-12 has-background-dark'>
        <div className='level is-mobile mx-2'>
          <div className='level-left'>
            <div className='level-item'>
              <span className='icon is-clickable' onClick={back}>
                <i class="fas fa-chevron-left has-text-white is-size-4 mr-1"></i>
              </span>
              <h4 className='title is-4 has-text-white'>Alerts</h4>
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

        <div>

        </div>
      </div>

    </div>
  )
}

export default AlertAsset
