import React, {Component} from 'react'
import Charts from './Charts'
import PairButtons from './PairButtons'
import WatchList from './watchlist'
import CreditsNotification from './CreditsNotification'

class MarketView extends Component {
  constructor(){
    super();
    this.state = {
      data: [],
      activePair:'',
      showCreditsNotification: false,
      showWatchlist: false
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

    return(
      <div>
        <div className="sidebar has-background-dark">
          <div className='columns'>
            <div className='column'>
              <div className='menu mt-6'>
                <ul className='menu-list'>
                  <a href="#" onClick={() => {this.setState({showWatchlist: !this.state.showWatchlist})}}>
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
        <div className='columns'>
          {this.state.showWatchlist &&
            <div className='column is-3'>
                <WatchList onClick={this.setActivePair}/>
            </div>
          }
          <div className={this.state.showWatchlist ? 'column is-9' : 'column is-12'}>
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
