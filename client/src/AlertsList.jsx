import {formateTimeFrame} from './utils'

const AlertsList = ({alerts}) => {

  return(
    <div className='alert-list'>
    {alerts.map((alert, idx) => {
      return(
        <div className='card has-background-dark has-text-white is-unselectable'>
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
      )
    })}
  </div>
  )
}

export default AlertsList
