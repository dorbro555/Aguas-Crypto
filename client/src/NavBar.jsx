
function NavBar(props){

  return(
    <div className='level mb-3 title-bar is-mobile'>
      <div className='level-left ml-1'>
        <div className='level-item'>
          <h1 className='title is-2 py-0 has-text-white'>¡Aguas! Crypto</h1>
        </div>
      </div>
      <div className='level-right  mr-1'>
        <div className='level-item'>
          <button className='button is-danger'>
            {
              props.isAuthenticated
              ?<a href='http://localhost:5000/logout'>Log out</a>
              :<a href='http://localhost:5000/login'>Log in</a>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavBar
