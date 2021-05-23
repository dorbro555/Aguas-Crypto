import {formateTimeFrame} from './utils'

const AlertsList = ({alerts, close}) => {

  return(
    <div className='alert-list columns is-multiline is-gapless'>
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
    {alerts.map((alert, idx) => {
      return(
        <div className='column is-12'>
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
      </div>
      )
    })}
  </div>
  )
}

export default AlertsList
