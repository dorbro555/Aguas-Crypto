import React, { Component } from 'react'
import Chart from './Chart'

class Charts extends Component {
  constructor(props){
    super(props);
    this.state = { data: [], isLoaded: false };
  }

  render(){
    const pairs = ['atom']
    const AllTimeframes = ['60','180', '300', '900', '1800', '3600', '7200', '14400', '21600', '43200', '86400', '259200', '604800']
    const timeframes = ['300', '1800', '7200']
    return(
      <div>
        {
          this.state.isLoaded &&
          <div className='columns is-multiline'>
            <div className='column is-4'>
              {timeframes.map( (val,idx) => {
                return <Chart key={idx} tf={this.state.data[val]}/>
              })}
            </div>
          </div>
        }
      </div>
    )
  }

  componentDidMount(){
    fetch('/api/ohlc/atom')
    .then(res => res.json())
		.then(res => {
      this.setState({
        isLoaded: true,
        data: res
      })
		});
  }
}



export default Charts
