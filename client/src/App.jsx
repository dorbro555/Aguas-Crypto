import logo from './logo.svg';
import './App.css';

import MarketView from './MarketView'
import NavBar from './NavBar'

function App() {
  return (
    <div className="App">
    <div className='columns has-background-dark'>
      <div className='column is-12'>
        <NavBar/>
        <MarketView/>
      </div>
    </div>

    </div>
  );
}

export default App;
