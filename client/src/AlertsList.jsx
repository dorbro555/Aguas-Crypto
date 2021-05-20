
const AlertsList = ({alerts}) => {

  return(
    <div>
    {alerts.map((alert, idx) => {
      return(

        <div className='alert-card'>
          <div className='card has-background-dark has-text-white'>
            <div className='card-content'>
              <div className='media my-0'>
                <div className='media-content'>
                  <div className='level'>
                    <div className='level-left'>
                      <div className='level-item'>
                        {alert.asset}
                      </div>
                      <div className='level-right'>
                        <time className='level-item'>
                          {alert.time}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='content'>
              {alert.scan} [{alert.tf}]
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
