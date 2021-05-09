import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
import {formateTimeFrame} from './utils' ;
import LineChart from './LineChart'
import IchimokuChartButton from './IchimokuChartButton'
import InfoHeader from './InfoHeader'

class Chart extends Component{
  constructor(props){
    super(props);
    this.state = {
      showIchimoku: false
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(){
    this.setState({showIchimoku: !this.state.showIchimoku})
  }

  render(){
    return(
      <div className='column is-4'>
        <div className='card'>
          <div className='card-image'>
            <figure className='image'>
              <div onClick={this.handleClick}>
                <LineChart tf={this.props.tf} timeframe={this.props.timeframe} activePair={this.props.activePair} showIchimoku={this.state.showIchimoku}/>
              </div>
            </figure>
          </div>
          <div className='content has-background-dark'>
            <InfoHeader tf={this.props.tf} showIchimoku={this.state.showIchimoku}/>
            <IchimokuChartButton tf={this.props.tf}/>
          </div>
        </div>
      </div>

    )
  }
}

export default Chart
