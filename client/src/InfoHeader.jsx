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
      ema21: 0,
      ema50: 0,
      ema100: 0,
      ema200: 0,
      isToggledPercent: true,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(){
    this.setState({isToggledPercent: !this.state.isToggledPercent})
  }

  render(){
    let deltaSpanA = (this.state.spanA-this.state.price)/this.state.price*100,
        deltaSpanB = (this.state.spanB-this.state.price)/this.state.price*100,
        deltaBaseLine = (this.state.baseLine-this.state.price)/this.state.price*100,
        deltaConversionLine = (this.state.conversionLine-this.state.price)/this.state.price*100,
        deltaSMA = (this.state.sma-this.state.price)/this.state.price*100,
        deltaPsar = (this.state.psar-this.state.price)/this.state.price*100,
        deltaEma21 = (this.state.ema21-this.state.price)/this.state.price*100,
        deltaEma50 = (this.state.ema50-this.state.price)/this.state.price*100,
        deltaEma100 = (this.state.ema100-this.state.price)/this.state.price*100,
        deltaEma200 = (this.state.ema200-this.state.price)/this.state.price*100,
        isToggledPercent = this.state.isToggledPercent
    return (
        <div className='box has-background-dark mb-0' onClick={this.handleClick}>
          <div className='columns is-multiline is-centered is-gapless is-mobile'>
            <div className='column mx-1' style={this.state.rsi < 70 && this.state.rsi > 30 ? {color: '#6272a4'} : {color: '#ffeedb'}}>RSI: {this.state.rsi.toFixed(2)}</div>
            {this.props.showIchimoku && <div className='column mx-1' style={{color: '#07df3d'}}>SpanA: {isToggledPercent ? deltaSpanA.toFixed(2)+'%' : '$'+this.state.spanA.toFixed(2)}</div>}
            {this.props.showIchimoku && <div className='column mx-1' style={{color: '#f00000'}}>SpanB: {isToggledPercent ? deltaSpanB.toFixed(2)+'%' : '$'+this.state.spanB.toFixed(2)}</div>}
            {this.props.showIchimoku && <div className='column mx-1' style={{color: '#f59a38'}}>BL: {isToggledPercent ? deltaBaseLine.toFixed(2)+'%' : '$'+this.state.baseLine.toFixed(2)}</div>}
            {this.props.showIchimoku && <div className='column mx-1' style={{color: '#d5589d'}}>CL: {isToggledPercent ? deltaConversionLine.toFixed(2)+'%' : '$'+this.state.conversionLine.toFixed(2)}</div>}
            <div className='column mx-1' style={{color: '#ffeedb'}}>SMA: {isToggledPercent ? deltaSMA.toFixed(2)+'%' : '$'+this.state.sma.toFixed(2)}</div>
            <div className='column mx-1' style={{color: '#81c6f4'}}>Psar: {isToggledPercent ? deltaPsar.toFixed(2)+'%' : '$'+this.state.psar.toFixed(2)}</div>
            {!this.props.showIchimoku && <div className='column mx-1' style={{color: '#0d8ce3'}}>21 EMA: {isToggledPercent ? deltaEma21.toFixed(2)+'%' : '$'+this.state.ema21.toFixed(2)}</div>}
            {!this.props.showIchimoku && <div className='column mx-1' style={{color: '#b1adeb'}}>50 EMA: {isToggledPercent ? deltaEma50.toFixed(2)+'%' : '$'+this.state.ema50.toFixed(2)}</div>}
            {!this.props.showIchimoku && <div className='column mx-1 is-size-7' style={{color: '#df9fd7'}}>100 EMA: {isToggledPercent ? deltaEma100.toFixed(2)+'%' : '$'+this.state.ema100.toFixed(2)}</div>}
            {!this.props.showIchimoku && <div className='column mx-1 is-size-7' style={{color: '#7cf8e0'}}>200 EMA: {isToggledPercent ? deltaEma200.toFixed(2)+'%' : '$'+this.state.ema200.toFixed(2)}</div>}
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
        ema21 = this.props.tf.ema['21'].values[this.props.tf.ema['21'].values.length-1],
        ema50 = this.props.tf.ema['50'].values[this.props.tf.ema['50'].values.length-1],
        ema100 = this.props.tf.ema['100'].values[this.props.tf.ema['100'].values.length-1],
        ema200 = this.props.tf.ema['200'].values[this.props.tf.ema['200'].values.length-1],
        price = this.props.tf.prices[this.props.tf.prices.length-1][4]

    this.setState({
      rsi: rsi.y,
      spanA: leadingSpans.y[0],
      spanB: leadingSpans.y[1],
      baseLine: baseLine.y,
      conversionLine: conversionLine.y,
      sma : sma.y,
      psar : psar.y,
      ema21 : ema21.y,
      ema50 : ema50.y,
      ema100 : ema100.y,
      ema200 : ema200.y,
      price: price
    })
  }
}

export default InfoHeader
