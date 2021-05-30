import React, { useState } from 'react'
import AlertsList from './AlertsList'
import AlertAsset from './AlertAsset'

const Alerts = ({ alerts, close, isMobile}) => {
  const [listVisible, setListVisible] = useState(true)
  const [asset, setAsset] = useState(null)

  return(
    !!alerts &&
    <div className={'' + (isMobile ? ' is-overlay' : '')}>
      {
        listVisible ? <AlertsList alerts={alerts} onClick={asset => {setAsset(asset); setListVisible(false)}} close={close}/>
      : <AlertAsset asset={asset} close={close} back={() => {setListVisible(true)}}/>
      }
    </div>
  )
}

export default Alerts
