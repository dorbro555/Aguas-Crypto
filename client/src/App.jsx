import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react'

import MarketView from './MarketView'
import NavBar from './NavBar'
import Sidebar from './Sidebar'
import TabBar from './TabBar'


function App() {
  //
  const [watchListVisible, setWatchListVisible] = useState(false)
  const [alertsListVisible, setAlertsListVisible] = useState(false)

  return (
      <div className='App columns has-background-dark is-gapless'>
        <div className='column'>
          <NavBar/>
          <MarketView watchListVisible={watchListVisible}
                      alertsListVisible={alertsListVisible}
                      closeWatchlist={() => {setWatchListVisible(false)}}
                      closeAlertsList={() => {setAlertsListVisible(false)}}/>
        </div>
        <div className='column is-narrow'>
          <Sidebar onClickWatchlist={() => {setWatchListVisible(!watchListVisible); setAlertsListVisible(false)}}
                    onClickAlertsList={() => {setAlertsListVisible(!alertsListVisible); setWatchListVisible(false)}}/>
        </div>
        <TabBar onClickWatchlist={() => {setWatchListVisible(!watchListVisible)}}
                 onClickAlertsList={() => {setAlertsListVisible(!alertsListVisible)}}
          />
      </div>
  );
}

export default App;
