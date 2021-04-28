import React, {Component} from 'react'
import Charts from './Charts'
import PairButtons from './PairButtons'

class MarketView extends Component {
  constructor(){
    super();
    this.state = {
      data: [],
      activePair:'',
    };
    this.setActivePair = this.setActivePair.bind(this)
  }

  setActivePair(pair){
    this.setState({data: []})
    fetch(`https://www.ahernandez.dev/trade/api/ohlc/${pair}`)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      this.setState({
        data: res,
        activePair: pair
      })
    });
  }

  render(){

    return(
      <div>
        <PairButtons onClick={this.setActivePair}/>
        <Charts activePair={this.state.activePair} windows={this.state.data.windows}/>
      </div>
    )
  }

  componentDidMount(){
    fetch(`https://www.ahernandez.dev/trade/api/ohlc/eth`)
    .then(res => res.json())
		.then(res => {
      this.setState({
        activePair: 'eth',
        data: res
      })
		});
  }
}

export default MarketView
