
const Sidebar = ({onClickWatchlist, onClickAlertsList}) => {

  return(
    <div className="sidebar has-background-dark is-hidden-touch">
      <div className='columns'>
        <div className='column'>
          <div className='menu mt-6'>
            <ul className='menu-list'>
              <li>
                <a onClick={onClickWatchlist} className='sidebar-button'>
                  <span className='icon'>
                    <i class="fas fa-list has-text-white"></i>
                  </span>
                </a>
            </li>
            <li>
              <a onClick={onClickAlertsList}>
                <span className='icon'>
                  <i class="far fa-bell has-text-white"></i>
                </span>
              </a>
            </li>
            <li>
              <a>
                <span className='icon'>
                  <i class="fas fa-retweet has-text-white"></i>
                </span>
              </a>
            </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Sidebar
