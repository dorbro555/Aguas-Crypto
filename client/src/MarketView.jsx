import React, {Component} from 'react'
import Charts from './Charts'
import PairButtons from './PairButtons'
import WatchList from './watchlist'
import AlertsList from './AlertsList'
import CreditsNotification from './CreditsNotification'
import Sidebar from './Sidebar'

class MarketView extends Component {
  constructor(){
    super();
    this.state = {
      data: [],
      activePair:'',
      showCreditsNotification: false,
      showWatchlist: false,
      showAlertsList: false
    };
    this.setActivePair = this.setActivePair.bind(this)
    this.toggleCreditsNotification = this.toggleCreditsNotification.bind(this)
  }

  setActivePair(pair){
    this.setState({
      data: [], //we must clear the data or the graph wont update
      showWatchlist: false //hide watchlist after clicking an item
    })
    fetch(`https://www.ahernandez.dev/trade/api/ohlc/${pair}`)
    .then(res => res.json())
    .then(res => {
      this.setState({
        data: res,
        activePair: pair
      })
    });
  }

  toggleCreditsNotification(){
    this.setState({showCreditsNotification: !this.state.showCreditsNotification})
  }

  render(){
    let alerts = this.state.data.alerts || []
    return(
      <div>
        <Sidebar onClickWatchlist={() => {this.setState({showWatchlist: !this.state.showWatchlist, showAlertsList: false})}}
                 onClickAlertsList={() => {this.setState({showAlertsList: !this.state.showAlertsList, showWatchlist: false})}}
          />
        <div className='columns is-gapless'>
          {this.state.showWatchlist &&
            <div className='column is-2'>
                <WatchList onClick={this.setActivePair}/>
            </div>
          }
          {
            this.state.showAlertsList &&
            <div className='column is-2'>
              <AlertsList alerts={alerts}/>
            </div>
          }
          <div className={this.state.showWatchlist || this.state.showAlertsList ? 'column is-10' : 'column is-12'}>
            <Charts activePair={this.state.activePair} windows={this.state.data.windows}/>
            {this.state.data.allowance && <CreditsNotification allowance={this.state.data.allowance} visible={this.state.showCreditsNotification} handleClick={this.toggleCreditsNotification}/>}
          </div>
        </div>
      </div>
    )
  }

  componentDidMount(){
    fetch(`https://www.ahernandez.dev/trade/api/ohlc/eth`)
    .then(res => res.json())
		.then(res => {
      this.setState({
        activePair: 'eth',
        data: res,
        showCreditsNotification: true,
      })
		});
  }

}

export default MarketView
