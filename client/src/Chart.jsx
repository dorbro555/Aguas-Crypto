import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
import {SMA, RSI, IchimokuCloud} from 'technicalindicators' ;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;


class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = { dataPoints1: [], dataPoints2: [], dataPoints3: [], isLoaded: false };
    this.calculateSMA = this.calculateSMA.bind(this)
    this.calculateRSI = this.calculateRSI.bind(this)
  }

  calculateSMA(dps, period){
    if(dps === undefined || dps.length == 0) return null
    period = period || 15

    let results = [],
        closes = dps.map((dataPoint) => dataPoint.y[3]),
        rawResults = SMA.calculate({period : period, values : closes}),
        nullArray = []
    for(var j = 0; j < period; j++){
      nullArray.push({
        x: dps[j].x,
        y: null
      })
    }
    results = rawResults.map((avg, i) => {
      return {
        x: dps[i+period-1].x,
        y: avg
      }
    })
    this.calculateIchimokuClouds(dps, 14)
    return nullArray.concat(results)
  }

  calculateRSI(dps, period){
    if(dps === undefined || dps.length == 0) return null
    period = period || 14

    let results = [],
        closes = dps.map((datapoint) => datapoint.y[3]),
        rsiResults = RSI.calculate({period: period, values: closes})

    console.log(rsiResults)
    return null
  }

  calculateIchimokuClouds(dps, period){
    if (dps === undefined || dps.length == 0) return null
    period = period || 14

    let highs = dps.map((dataPoint) => dataPoint.y[1]),
        lows = dps.map((dataPoint) => dataPoint.y[2]),
        conversionPeriod = 9,
        basePeriod = 26,
        spanPeriod = 52,
        displacement = 26

    var results = IchimokuCloud.calculate({high: highs, low: lows, conversionPeriod: conversionPeriod, basePeriod: basePeriod, spanPeriod: spanPeriod, displacement: displacement})
    console.log(results)
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
            dataPoints : this.state.dataPoints1.slice(-range)
          },
          {
            name: "SMA",
            type: "line",
            visible: showSMA,
            axisYType: "secondary",
            dataPoints : this.calculateSMA(this.state.dataPoints1.slice(-range), 15)
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
            dataPoints : this.state.dataPoints2.slice(-range)
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
    let result = this.props.tf
    var dps1 = [], dps2 = []
    for (var i = 0; i < result.length; i++) {
      dps1.push({
        x: new Date(result[i][0]*1000),
        y: result[i].slice(1, 5)
      });
      dps2.push({x: new Date(result[i][0]*1000), y: result[i][6]})
    }
    this.setState({
      isLoaded: true,
      dataPoints1: dps1,
      dataPoints2: dps2
    })
  }
}

export default Chart
