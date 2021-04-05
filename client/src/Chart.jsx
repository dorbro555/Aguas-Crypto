import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
import {calculateSMA, calculateRSI, calculateIchimokuClouds, calculateFutureDates, calculateBBand} from './utils' ;
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;


class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPoints1: [],
      dataPoints2: [],
      price: [],
      volume: [],
      sma: [],
      ichimokuCloud: [],
      baseLine: [],
      conversionLine: [],
      bollingerBand: [],
      indicators: {},
      isLoaded: false
    };
  }

  render() {
    const showSMA = false
    const showIchimoku = true
    const range = 100
    const options = {
      theme: "light2",
      title:{
        text:"Atom Price (ATOM)"
      },
      subtitles: [{
        text: (this.props.timeframe / 60) + ' min'
      }],
      height:1000,
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
            title: "Price",
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
            markerType: 'none',
            dataPoints : this.state.sma
          },
          {
            name: "Conversion Line",
            type: "line",
            visible: showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            dataPoints : this.state.conversionLine
          },
          {
            name: "Base Line",
            type: "line",
            visible: showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            dataPoints : this.state.baseLine
          },
          {
            name: "Chikou",
            type: "line",
            visible: showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            dataPoints : this.state.chikou
          },
          {
            name: 'Senkou',
            type: "rangeSplineArea",
            visible: showIchimoku,
            axisYType: 'secondary',
            markerType: 'none',
            color: 'green',
            dataPoints: this.state.ichimokuCloud.greenSenkou
          },
          {
            name: 'Red Senkou',
            type: "rangeSplineArea",
            visible: showIchimoku,
            axisYType: 'secondary',
            markerType: 'none',
            color: 'red',
            dataPoints: this.state.ichimokuCloud.redSenkou
          },
          {
            name: 'Bollinger Band',
            type: "rangeSplineArea",
            axisYType: 'secondary',
            markerType: 'none',
            color: 'teal',
            fillOpacity: .1,
            dataPoints: this.state.bollingerBand.bands
          },
          ]
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
        },
          {
          title:{
            text: "Cloud Color"
          },
          visible: showIchimoku,
          height: 100,
          axisY2: {
            maximum: 1
          },
          dataPointMinWidth: 3,
          data: [
            {
              axisYType: "secondary",
              dataPoints: this.state.indicators.senkouIndicator,
            }
          ]
        },
        {
            title:{
              text: "Cloud/Action"
            },
            height: 100,
            axisY2: {
              maximum: 1
            },
            dataPointMinWidth: 3,
            data: [
              {
                axisYType: "secondary",
                dataPoints: this.state.indicators.cloudActionIndicator,
              }
            ]
          },
        {
            title:{
              text: "TK Cross"
            },
            height: 100,
            axisY2: {
              maximum: 1
            },
            dataPointMinWidth: 3,
            data: [
              {
                axisYType: "secondary",
                dataPoints: this.state.indicators.tkIndicator,
              }
            ]
          },
          {
              title:{
                text: "Chikou/Action"
              },
              height: 100,
              axisY2: {
                maximum: 1
              },
              dataPointMinWidth: 3,
              data: [
                {
                  axisYType: "secondary",
                  dataPoints: this.state.indicators.chikouActionIndicator,
                }
              ]
            },
            {
                title:{
                  text: "Action/Base"
                },
                height: 100,
                axisY2: {
                  maximum: 1
                },
                dataPointMinWidth: 3,
                data: [
                  {
                    axisYType: "secondary",
                    dataPoints: this.state.indicators.KenBaseIndicator,
                  }
                ]
              },
              // {
              //   name: 'Bollinger Band',
              //   type: "rangeSplineArea",
              //   axisYType: 'secondary',
              //   markerType: 'none',
              //   color: 'technicalindicators',
              //   dataPoints: this.state.bollingerBand.result
              // },

      ],
      navigator: {
        enabled: false
      },
      rangeSelector: {
        enabled: false
      }
    };
    const containerProps = {
      width: "100%",
      height: "1000px",
      margin: "auto"
    };
    return (
      <div className='column is-4'>
        <div className='card'>
          <div className='card-image'>
            <figure className='image'>
            {
              this.state.isLoaded &&
              <CanvasJSStockChart containerProps={containerProps} options = {options}
                /* onRef = {ref => this.chart = ref} */
              />}
            </figure>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(){
    let result = this.props.tf,
        range = 100
    var dps1 = [], dps2 = [], dates = []
    for (var i = 0; i < result.length; i++) {
      var readableDate = new Date(result[i][0]*1000)
      dates.push(readableDate)
      dps1.push({
        x: readableDate,
        y: result[i].slice(1, 5)
      });
      dps2.push({x: readableDate, y: result[i][6]})
    }
    let recentDate = result[result.length-1][0]*1000,
        paddedWindow = calculateFutureDates(recentDate, this.props.timeframe),
        price = dps1.slice(-range).concat(paddedWindow),
        volume = dps2.slice(-range),
        sma = calculateSMA(price),
        ichimokuCloud = calculateIchimokuClouds(dps1.slice(-(range+78)).concat(paddedWindow), range),
        bollingerBand = calculateBBand(dps1.slice(-range-20))
    console.log(bollingerBand)

    this.setState({
      isLoaded: true,
      dataPoints1: dps1,
      dataPoints2: dps2,
      dates: dates,
      price,
      volume,
      sma,
      ichimokuCloud: {
        greenSenkou: ichimokuCloud.senkou,
        redSenkou: ichimokuCloud.redSenkou
      },
      baseLine: ichimokuCloud.baseLine,
      conversionLine: ichimokuCloud.conversionLine,
      chikou: ichimokuCloud.chikou,
      bollingerBand: bollingerBand,
      indicators: {
        senkouIndicator: ichimokuCloud.senkouIndicator,
        tkIndicator: ichimokuCloud.tkIndicator,
        chikouActionIndicator: ichimokuCloud.chikouActionIndicator,
        cloudActionIndicator: ichimokuCloud.cloudActionIndicator,
        KenBaseIndicator: ichimokuCloud.actionBaseLineIndicator ,
      },
    })
  }
}

export default Chart
