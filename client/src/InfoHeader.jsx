import React, {Component} from 'react'

class InfoHeader extends Component {
  constructor(props){
    super(props)
    this.state = {
      rsi: 0,
      price: 0,
      spanA: 0,
      spanB: 0,
      baseLine: 0,
      conversionLine: 0,
      sma: 0,
      psar: 0,
      ema: 0,
      isToggled: true,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(){
    this.setState({isToggled: !this.state.isToggled})
  }

  render(){
    let deltaSpanA = (this.state.spanA-this.state.price)/this.state.price*100,
        deltaSpanB = (this.state.spanB-this.state.price)/this.state.price*100,
        deltaBaseLine = (this.state.baseLine-this.state.price)/this.state.price*100,
        deltaConversionLine = (this.state.conversionLine-this.state.price)/this.state.price*100,
        deltaSMA = (this.state.sma-this.state.price)/this.state.price*100,
        deltaPsar = (this.state.psar-this.state.price)/this.state.price*100,
        deltaEma = (this.state.ema-this.state.price)/this.state.price*100,
        isToggled = this.state.isToggled
    return (
        <div className='box has-background-dark mb-0' onClick={this.handleClick}>
          <div className='columns is-multiline is-centered is-gapless is-mobile'>
            <div className='column mx-1' style={this.state.rsi < 70 && this.state.rsi > 30 ? {color: '#6272a4'} : {color: '#ffeedb'}}>RSI: {this.state.rsi.toFixed(2)}</div>
            <div className='column mx-1' style={{color: '#07df3d'}}>SpanA: {isToggled ? deltaSpanA.toFixed(2)+'%' : '$'+this.state.spanA.toFixed(2)}</div>
            <div className='column mx-1' style={{color: '#f00000'}}>SpanB: {isToggled ? deltaSpanB.toFixed(2)+'%' : '$'+this.state.spanB.toFixed(2)}</div>
            <div className='column mx-1' style={{color: '#f59a38'}}>BL: {isToggled ? deltaBaseLine.toFixed(2)+'%' : '$'+this.state.baseLine.toFixed(2)}</div>
            <div className='column mx-1' style={{color: '#d5589d'}}>CL: {isToggled ? deltaConversionLine.toFixed(2)+'%' : '$'+this.state.conversionLine.toFixed(2)}</div>
            <div className='column mx-1' style={{color: '#ffeedb'}}>SMA: {isToggled ? deltaSMA.toFixed(2)+'%' : '$'+this.state.sma.toFixed(2)}</div>
            <div className='column mx-1' style={{color: '#81c6f4'}}>Psar: {isToggled ? deltaPsar.toFixed(2)+'%' : '$'+this.state.psar.toFixed(2)}</div>
            <div className='column mx-1' style={{color: '#7cf8e0'}}>EMA: {isToggled ? deltaEma.toFixed(2)+'%' : '$'+this.state.ema.toFixed(2)}</div>
          </div>
        </div>
    )
  }

  componentDidMount(){
    let rsi = this.props.tf.rsi.values[this.props.tf.rsi.values.length-1],
        leadingSpans = this.props.tf.ichimokuCloud.leadingSpans[this.props.tf.ichimokuCloud.leadingSpans.length-27],
        baseLine = this.props.tf.ichimokuCloud.baseLine[this.props.tf.ichimokuCloud.baseLine.length-1],
        conversionLine = this.props.tf.ichimokuCloud.conversionLine[this.props.tf.ichimokuCloud.conversionLine.length-1],
        sma = this.props.tf.bband.sma[this.props.tf.bband.sma.length-1],
        psar = this.props.tf.psar.values[this.props.tf.psar.values.length-1],
        ema = this.props.tf.ema.values[this.props.tf.ema.values.length-1],
        price = this.props.tf.prices[this.props.tf.prices.length-1][4]

    this.setState({
      rsi: rsi.y,
      spanA: leadingSpans.y[0],
      spanB: leadingSpans.y[1],
      baseLine: baseLine.y,
      conversionLine: conversionLine.y,
      sma : sma.y,
      psar : psar.y,
      ema : ema.y,
      price: price
    })
  }
}

export default InfoHeader
