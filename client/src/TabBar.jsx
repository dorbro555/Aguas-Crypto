
const TabBar = ({onClickWatchlist, onClickAlertsList}) => {

  return (
    <div className='tabs mb-0 tab-bar is-fullwidth has-background-primary is-hidden-desktop'>
      <ul>
        <li><a onClick={onClickWatchlist}>
          <span className='icon'>
            <i class="fas fa-list has-text-white"></i>
          </span>
        </a></li>
        <li><a onClick={onClickAlertsList}>
          <span className='icon'>
            <i class="far fa-bell has-text-white"></i>
          </span>
        </a></li>
        <li><a>
          <span className='icon'>
            <i class="fas fa-retweet has-text-white"></i>
          </span>
        </a></li>
      </ul>
    </div>
  )
}

export default TabBar
