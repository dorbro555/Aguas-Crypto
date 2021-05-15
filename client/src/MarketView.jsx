import React, {Component} from 'react'
import Charts from './Charts'
import PairButtons from './PairButtons'
import CreditsNotification from './CreditsNotification'

class MarketView extends Component {
  constructor(){
    super();
    this.state = {
      data: [],
      activePair:'',
      showCreditsNotification: false,
    };
    this.setActivePair = this.setActivePair.bind(this)
    this.toggleCreditsNotification = this.toggleCreditsNotification.bind(this)
  }

  setActivePair(pair){
    this.setState({data: []})
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
        <PairButtons onClick={this.setActivePair}/>
        <Charts activePair={this.state.activePair} windows={this.state.data.windows}/>
        {this.state.data.allowance && <CreditsNotification allowance={this.state.data.allowance} visible={this.state.showCreditsNotification} handleClick={this.toggleCreditsNotification}/>}
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
