import {formatTimeFrame} from './utils'

const Alert = ({alerts, onClick}) => {
  let alert = alerts[0],
      recentAlerts = alerts.slice(0, 4) || alerts.slice(0, alerts.len-1)

  return(
    <div className='alert column is-12' onClick={() => {onClick(alerts)}}>
      <div className={`card has-background-dark has-text-white is-unselectable`}>
        <div className='card-content'>
          <div className='media my-0'>
            <div className='media-content'>
              <div className='level has-text-weight-semibold'>
                <div className='level-left'>
                  <div className='level-item'>
                    {alert.asset}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {
            recentAlerts.map((alert, idx) =>
              <div className={`level my-0 has-text-${alert.position==='long' ?'success':'danger'}`} key={idx}>
                <div className='level-left'>
                  <div className='level-item is-size-7'>
                    {alert.scan} [{formatTimeFrame(alert.tf)}]
                  </div>
                </div>
                <div className='level-right'>
                  <time className='level-item is-size-7 has-text-weight-semibold'>
                    {new Date(alert.time).toLocaleTimeString('en-US')}
                  </time>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Alert
