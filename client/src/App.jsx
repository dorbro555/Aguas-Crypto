import logo from './logo.svg';
import './App.css';

import MarketView from './MarketView'
import NavBar from './NavBar'

function App() {
  return (
    <div className="App">
      <div className="sidebar">
        <div className='columns'>
          <div className='column'>
            <div className='menu'>
              <ul className='menu-list'>
                <a href="#">
                  <span className='icon'>
                    <i class="fas fa-list has-text-white"></i>
                  </span>
                </a>
                <a href="#">
                  <span className='icon'>
                    <i class="far fa-bell has-text-white"></i>
                  </span>
                </a>
                <a href="#">
                  <span className='icon'>
                    <i class="fas fa-retweet has-text-white"></i>
                  </span>
                </a>
              </ul>
            </div>

          </div>
        </div>
      </div>
    <div className='columns has-background-dark ml-6'>
      <div className='column is-12'>
        <NavBar/>
        <MarketView/>
      </div>
    </div>

    </div>
  );
}

export default App;
