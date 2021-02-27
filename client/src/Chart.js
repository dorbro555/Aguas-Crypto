import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

const { RESTClient } = require('cw-sdk-node')


var dataPoints = [];

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = { dataPoints1: [], dataPoints2: [], dataPoints3: [], isLoaded: false };
  }

  componentDidMount(){
    fetch('/api/ohlc')
    .then(res => res.json())
		.then(result => {
      console.log(result)
      var dps1 = [], dps2 = [], dps3 = [];
			for (var i = 0; i < result.length; i++) {
				dps1.push({
					x: new Date(result[i][0]),
					y: result[i].slice(1, 5)
				});
        dps2.push({x: new Date(result[i][0]), y: result[i][6]})
        dps3.push({x: new Date(result[i][0]), y: result[i][4]})

      }
      this.setState({
        isLoaded: true,
        dataPoints1: dps1,
        dataPoints2: dps2,
        dataPoints3: dps3
      })
		});
	}

  render() {
    const options = {
      theme: "light2",
      title:{
        text:"React StockChart with Date-Time Axis"
      },
      subtitles: [{
        text: "Price-Volume Trend"
      }],
      charts: [{
        axisX: {
          lineThickness: 5,
          tickLength: 0,
          labelFormatter: function(e) {
            return "";
          },
          crosshair: {
            enabled: true,
            snapToDataPoint: true,
            labelFormatter: function(e) {
              return "";
            }
          }
        },
        axisY: {
          title: "Litecoin Price",
          prefix: "$",
          tickLength: 0
        },
        toolTip: {
          shared: true
        },
        data: [{
          name: "Price (in USD)",
          yValueFormatString: "$#,###.##",
          type: "candlestick",
          dataPoints : this.state.dataPoints1
        }]
      },{
        height: 100,
        axisX: {
          crosshair: {
            enabled: true,
            snapToDataPoint: true
          }
        },
        axisY: {
          title: "Volume",
          prefix: "$",
          tickLength: 0
        },
        toolTip: {
          shared: true
        },
        data: [{
          name: "Volume",
          yValueFormatString: "$#,###.##",
          type: "column",
          dataPoints : this.state.dataPoints2
        }]
      }],
      navigator: {
        data: [{
          dataPoints: this.state.dataPoints3
        }],
        slider: {
          minimum: new Date("2018-05-01"),
          maximum: new Date("2018-07-01")
        }
      }
    };
    const containerProps = {
      width: "100%",
      height: "450px",
      margin: "auto"
    };
    return (
      <div>
        <div>
          {
            // Reference: https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator
            this.state.isLoaded &&
            <CanvasJSStockChart containerProps={containerProps} options = {options}
              /* onRef = {ref => this.chart = ref} */
            />
          }
        </div>
      </div>
    );
  }


}

export default Chart
