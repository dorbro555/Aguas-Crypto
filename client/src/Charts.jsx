import React, { Component } from 'react'
import Chart from './Chart'
import PairButtons from './PairButtons'

class Charts extends Component {
  constructor(props){
    super(props);
  }

  render(){
    const AllTimeframes = ['60','180', '300', '900', '1800', '3600', '7200', '14400', '21600', '43200', '86400', '259200', '604800']
    const devtimeFrames = ['300', '1800', '7200', '14400', '86400']
    const timeframes = ['86400', '14400', '300']
    return(
      <div>
        {
          this.props.windows &&
          <div className='columns is-multiline'>
              {AllTimeframes.map( (val,idx) => {
                return <Chart key={idx} tf={this.props.windows[val]} timeframe={val} activePair={this.props.activePair}/>
              })}
          </div>
        }
      </div>
    )
  }


}



export default Charts
