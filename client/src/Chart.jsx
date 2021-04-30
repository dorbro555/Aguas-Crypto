import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
import {formateTimeFrame} from './utils' ;
import LineChart from './LineChart'
import IchimokuChartButton from './IchimokuChartButton'

class Chart extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className='column is-4'>
        <div className='card'>
          <div className='card-image'>
            <figure className='image'>
              <div>
                <LineChart tf={this.props.tf} timeframe={this.props.timeframe} activePair={this.props.activePair}/>
                <IchimokuChartButton tf={this.props.tf} timeframe={this.props.timeframe} activePair={this.props.activePair}/>
              </div>
            </figure>
          </div>
        </div>
      </div>

    )
  }
}

export default Chart
