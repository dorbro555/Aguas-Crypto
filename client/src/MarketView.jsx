import React, {Component} from 'react'
import Charts from './Charts'
import PairButtons from './PairButtons'
import WatchList from './watchlist'
import Alerts from './Alerts'
import CreditsNotification from './CreditsNotification'

class MarketView extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {},
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
    })
    this.props.closeWatchlist() //hide watchlist after clicking an item

    // TODO update apiUrl based on production environment
    // const apiUrl = process.env.NODE_ENV === 'production'
    // ? process.env.REACT_APP_API_URL_PROD
    // : process.env.REACT_APP_API_URL_DEV;

    // TODO add CORS to server to get the below fetch to work
    //fetch(`http://localhost:5000/api/ohlc/${pair}`)
    fetch(`trade.ahernandez.dev/api/ohlc/${pair}`)
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
          { !!this.state.data ? <div className='columns is-gapless is-clipped'>
            {!this.props.hideChart &&
              <div className={this.props.watchListVisible || this.props.alertsListVisible ? 'column is-10' : 'column is-12'}>
                <Charts activePair={this.state.activePair} windows={this.state.data.windows}/>
              </div>
            }
            {this.state.data.allowance && <CreditsNotification allowance={this.state.data.allowance} visible={this.state.showCreditsNotification} handleClick={this.toggleCreditsNotification}/>}
            {this.props.watchListVisible &&
              <div className='column is-2'>
                <WatchList onClick={this.setActivePair} close={this.props.closeWatchlist} isMobile={this.props.hideChart}/>
              </div>
            }
            {
              this.props.alertsListVisible &&
              <div className='column is-2'>
                <Alerts alerts={this.state.data.alerts} close={this.props.closeAlertsList} isMobile={this.props.hideChart}/>
              </div>
            }
          </div>
          : <div>Loading</div>
        }
      </div>
    )
  }

  componentDidMount(){
    fetch(`http://localhost:5000/api/ohlc/eth`)
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
