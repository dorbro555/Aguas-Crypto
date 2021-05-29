import {formateTimeFrame} from './utils'

const Alert = ({alert, onClick, isLong}) => {

  return(
    <div className='alert column is-12' onClick={() => {onClick(alert.asset)}}>
      <div className={`card has-background-${isLong?'success':'danger'}-light has-text-${isLong?'success':'danger'}-dark is-unselectable`}>
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
}

export default Alert
