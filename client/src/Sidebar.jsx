
const Sidebar = ({onClick}) => {

  return(
    <div className="sidebar has-background-dark">
      <div className='columns'>
        <div className='column'>
          <div className='menu mt-6'>
            <ul className='menu-list'>
              <a onClick={onClick}>
                <span className='icon'>
                  <i class="fas fa-list has-text-white"></i>
                </span>
              </a>
              <a>
                <span className='icon'>
                  <i class="far fa-bell has-text-white"></i>
                </span>
              </a>
              <a>
                <span className='icon'>
                  <i class="fas fa-retweet has-text-white"></i>
                </span>
              </a>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Sidebar
