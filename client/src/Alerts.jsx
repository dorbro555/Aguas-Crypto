import React, { useState } from 'react'
import AlertsList from './AlertsList'
import AlertAssetPage from './AlertAsset'

const Alerts = ({ alerts, close, isMobile}) => {
  const [listVisible, setListVisible] = useState(true)
  const [asset, setAsset] = useState(null)

  return(
    !!alerts &&
    <div className={'' + (isMobile ? ' is-overlay' : '')}>
      {
        listVisible ? <AlertsList alerts={alerts} onClick={asset => {setAsset(asset); setListVisible(false)}} close={close}/>
      : <AlertAssetPage assets={asset} close={close} back={() => {setListVisible(true)}}/>
      }
    </div>
  )
}

export default Alerts
