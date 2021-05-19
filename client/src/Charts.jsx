import React, { Component } from 'react'
import ChartsRangeButton from './ChartsRangeButton'

class Charts extends Component {
  constructor(props){
    super(props);
  }

  render(){
    const AllTimeframes = ['60','180', '300', '900', '1800', '3600', '7200', '14400', '21600', '43200', '86400', '259200']
    const devtimeFrames = ['60', '180', '1800', '3600', '21600']
    const volatileRange = ['60','180', '300']
    const shortRange = ['900', '1800', '3600']
    const moderateRange = ['7200', '14400', '21600']
    const LongRange = ['43200', '86400', '259200']
    return(
      <div>
        {
          this.props.windows &&
          <div className='columns is-multiline'>
            <div className='column is-12'>
              <ChartsRangeButton range={volatileRange} title={'Volatile Range'} windows={this.props.windows} activePair={this.props.activePair}/>
              <ChartsRangeButton range={shortRange} title={'Short Range'} windows={this.props.windows} activePair={this.props.activePair} isToggled={true}/>
              <ChartsRangeButton range={moderateRange} title={'Moderate Range'} windows={this.props.windows} activePair={this.props.activePair}/>
              <ChartsRangeButton range={LongRange} title={'Long Range'} windows={this.props.windows} activePair={this.props.activePair}/>
            </div>
          </div>
        }
      </div>
    )
  }


}



export default Charts
