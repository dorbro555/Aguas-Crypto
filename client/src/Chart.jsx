import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
import {calculateSMA, calculateRSI, calculateIchimokuClouds, calculateFutureDates} from './utils' ;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;


class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = { dataPoints1: [], dataPoints2: [], dataPoints3: [], isLoaded: false };
  }

  render() {
    const showSMA = true
    const range = 100
    const options = {
      theme: "light2",
      title:{
        text:"Ethereum Price (ETH)"
      },
      subtitles: [{
        text: "Ethereum Price (ETH)"
      }],
      charts: [
        {
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
          axisY2: {
            title: "Litecoin Price",
            prefix: "$",
            tickLength: 0,
            scaleBreaks: {
              autoCalculate: true
            }
          },
          toolTip: {
            shared: true
          },
          dataPointMinWidth: 2,
          data: [{
            name: "Price (in USD)",
            yValueFormatString: "$#,###.##",
            xValueFormatString: "MMM DD HH:mm",
            type: "candlestick",
            axisYType: "secondary",
            dataPoints : this.state.price
          },
          {
            name: "SMA",
            type: "line",
            visible: showSMA,
            axisYType: "secondary",
            dataPoints : this.state.sma
          },
          {
            name: 'Senkou',
            type: "rangeSplineArea",
            axisYType: 'secondary',
            dataPoints: this.state.ichimokuCloud
          }]
        },
        {
          height: 100,
          axisX: {
            crosshair: {
              enabled: true,
              snapToDataPoint: true
            }
          },
          axisY2: {
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
            axisYType: "secondary",
            dataPoints : this.state.volume
          }]
        }],
      navigator: {
        enabled: false
      },
      rangeSelector: {
        enabled: false
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
            this.state.isLoaded &&
            <CanvasJSStockChart containerProps={containerProps} options = {options}
              /* onRef = {ref => this.chart = ref} */
            />}
        </div>
      </div>
    );
  }

  componentDidMount(){
    let result = this.props.tf,
        range = 100
    var dps1 = [], dps2 = []
    for (var i = 0; i < result.length; i++) {
      dps1.push({
        x: new Date(result[i][0]*1000),
        y: result[i].slice(1, 5)
      });
      dps2.push({x: new Date(result[i][0]*1000), y: result[i][6]})
    }
    let recentDate = result[result.length-1][0]*1000,
        paddedWindow = calculateFutureDates(recentDate, this.props.timeframe),
        price = dps1.slice(-range).concat(paddedWindow),
        volume = dps2.slice(-range),
        sma = calculateSMA(price),
        ichimokuCloud = calculateIchimokuClouds(dps1.slice(-range))

    this.setState({
      isLoaded: true,
      dataPoints1: dps1,
      dataPoints2: dps2,
      price,
      volume,
      sma,
      ichimokuCloud
    })
  }
}

export default Chart
