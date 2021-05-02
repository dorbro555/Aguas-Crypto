import React, {Component} from 'react'

class InfoHeader extends Component {
  constructor(props){
    super(props)
    this.state = {
      rsi: 0,
      price: 0,
      baseLine: 0,
      conversionLine: 0
    }
  }

  render(){


    return (
      <div>
        <div className='button is-dark is-fullwidth'>
          <div>RSI: {this.state.rsi.toFixed(2)}</div> |
          <div>Price: {this.state.price}</div>|
          <div>BL: {this.state.baseLine.toFixed(2)}</div>|
          <div>CL: {this.state.conversionLine.toFixed(2)}</div>
        </div>
      </div>
    )
  }

  componentDidMount(){
    let rsi = this.props.tf.rsi.values[this.props.tf.rsi.values.length-1],
        price = this.props.tf.prices[this.props.tf.prices.length-1][4],
        baseLine = this.props.tf.ichimokuCloud.baseLine[this.props.tf.ichimokuCloud.baseLine.length-1],
        conversionLine = this.props.tf.ichimokuCloud.conversionLine[this.props.tf.ichimokuCloud.conversionLine.length-1]

    this.setState({
      rsi: rsi.y,
      price: price,
      baseLine: baseLine.y,
      conversionLine: conversionLine.y
    })
  }
}

export default InfoHeader
