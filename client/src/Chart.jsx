import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
import {formateTimeFrame} from './utils' ;
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
      bollingerBand: {},
      rsi: [],
      psar: {},
      ema: [],
      indicators: {},
      isLoaded: false
    };
  }

  render() {
    const showSMA = false
    const showIchimoku = true
    const range = 60
    const dataPointMinWidth = 6
    const indicatorHeight = 55
    const options = this.state.isLoaded ? {
      theme: "dark2",
      // title:{
      //   text: formateTimeFrame(this.props.timeframe) + ` ${this.props.activePair.toUpperCase()} Price`
      // },
      subtitles: [{
        text: formateTimeFrame(this.props.timeframe) + ` ${this.props.activePair.toUpperCase()} Price`
      }],
      height:810,
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
            xValueType: "dateTime",
            type: "candlestick",
            axisYType: "secondary",
            dataPoints : this.state.price
          },
          {
            name: "Conversion Line",
            type: "line",
            visible: showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            color: '#d5589d',
            dataPoints : this.state.ichimokuCloud.conversionLine
          },
          {
            name: "Base Line",
            type: "line",
            visible: showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            color: '#f59a38',
            dataPoints : this.state.ichimokuCloud.baseLine
          },
          {
            name: "Chikou",
            type: "line",
            visible: showIchimoku,
            axisYType: "secondary",
            color: '#725ce5',
            markerType: 'none',
            dataPoints : this.state.ichimokuCloud.laggingSpan
          },
          {
            name: "200 EMA",
            type: "line",
            visible: showIchimoku,
            axisYType: "secondary",
            color: '#7cf8e0',
            markerType: 'none',
            dataPoints : this.state.ema
          },
          {
            name: 'Senkou',
            type: "rangeSplineArea",
            visible: showIchimoku,
            axisYType: 'secondary',
            markerType: 'none',
            color: '#07df3d',
            dataPoints: this.state.ichimokuCloud.greenCloud
          },
          {
            name: 'Red Senkou',
            type: "rangeSplineArea",
            visible: showIchimoku,
            axisYType: 'secondary',
            markerType: 'none',
            color: '#f00000',
            dataPoints: this.state.ichimokuCloud.redCloud
          },
          {
            name: 'Bollinger Band',
            type: "rangeSplineArea",
            axisYType: 'secondary',
            markerType: 'none',
            color: '#6272a4',
            fillOpacity: .1,
            dataPoints: this.state.bollingerBand.bands
          },
          {
            name: "Bollinger Band SMA",
            type: "line",
            axisYType: "secondary",
            markerType: 'none',
            color: '#ffeedb',
            lineDashType: 'shortDash',
            dataPoints : this.state.bollingerBand.sma
          },
          {
            name: "PSar",
            type: "line",
            lineThickness: 0.1,
            markerSize: 3,
            axisYType: "secondary",
            markerType: 'circle',
            color: '#81c6f4',
            dataPoints : this.state.psar.values
          },
          ]
        },
        // {
        //   height: 80,
        //   axisX: {
        //     crosshair: {
        //       enabled: true,
        //       snapToDataPoint: true
        //     },
        //     labelFormatter: function(e) {
        //       return "";
        //     },
        //   },
        //   axisY2: {
        //     title: "Volume",
        //     prefix: "$",
        //     tickLength: 0,
        //     labelFormatter: function(e){
        //       let unit = "M",
        //           value = e.value / 1000
        //       if(value >= 1000){return value/1000 + "B"}
        //       else{return e.value / 1000 + "M"}
        //     },
        //   },
        //   toolTip: {
        //     shared: true
        //   },
        //   data: [{
        //     name: "Volume",
        //     type: "column",
        //     color: '#50fa7b',
        //     axisYType: "secondary",
        //     dataPoints : this.state.volume
        //   }]
        // },
        {

            height: 100,
            axisY2: {
              maximum: 70,
              minimum: 30,
              title:"RSI",
            },
            dataPointMinWidth: dataPointMinWidth,
            data: [
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineColor: '#6272a4',
                dataPoints: this.state.rsi,
              }
            ]
          },
          {

              height: 100,
              axisY2: {
                maximum: 100,
                minimum: 0,
                title:"%B",
              },
              dataPointMinWidth: dataPointMinWidth,
              data: [
                {
                  axisYType: "secondary",
                  xValueType: "dateTime",
                  type:'line',
                  dataPoints: this.state.bollingerBand.percent,
                }
              ]
            },
          {
          title:{
            text: "Cloud Color"
          },
          axisX: {
            labelFormatter: function(e) {
              return "";
            },
          },
          visible: showIchimoku,
          height: indicatorHeight,
          axisY2: {
            maximum: 1
          },
          dataPointMinWidth: dataPointMinWidth,
          data: [
            {
              axisYType: "secondary",
              xValueType: "dateTime",
              dataPoints: this.state.ichimokuCloud.cloudIndicator,
            }
          ]
        },
        {
            title:{
              text: "Cloud/Action"
            },
            height: indicatorHeight,
            axisX: {
              labelFormatter: function(e) {
                return "";
              },
            },
            axisY2: {
              maximum: 1
            },
            dataPointMinWidth: dataPointMinWidth,
            data: [
              {
                xValueType: "dateTime",
                axisYType: "secondary",
                dataPoints: this.state.ichimokuCloud.cloudActionIndicator,
              }
            ]
          },
          {
              title:{
                text: "TK Cross"
              },
              axisX: {
                labelFormatter: function(e) {
                  return "";
                },
              },
              height: indicatorHeight,
              axisY2: {
                maximum: 1
              },
              dataPointMinWidth: dataPointMinWidth,
              data: [
                {
                  axisYType: "secondary",
                  xValueType: "dateTime",
                  dataPoints: this.state.ichimokuCloud.tkCrossIndicator,
                }
              ]
            },
            {
                title:{
                  text: "Chikou/Action"
                },
                height: indicatorHeight,
                axisX: {
                  labelFormatter: function(e) {
                    return "";
                  },
                },
                axisY2: {
                  maximum: 1
                },
                dataPointMinWidth: dataPointMinWidth,
                data: [
                  {
                    axisYType: "secondary",
                    xValueType: "dateTime",
                    dataPoints: this.state.ichimokuCloud.chikouActionIndicator,
                  }
                ]
              },
              {
                  title:{
                    text: "Action/Base"
                  },
                  axisX: {
                    labelFormatter: function(e) {
                      return "";
                    },
                  },
                  height: indicatorHeight,
                  axisY2: {
                    maximum: 1
                  },
                  dataPointMinWidth: dataPointMinWidth,
                  data: [
                    {
                      axisYType: "secondary",
                      xValueType: "dateTime",
                      dataPoints: this.state.ichimokuCloud.actionBaseLineIndicator,
                    }
                  ]
                },
                // {
                //     title:{
                //       text: "Psar/Action"
                //     },
                //     axisX: {
                //       labelFormatter: function(e) {
                //         return "";
                //       },
                //     },
                //     height: indicatorHeight,
                //     axisY2: {
                //       maximum: 1
                //     },
                //     xValueType: "dateTime",
                //     dataPointMinWidth: dataPointMinWidth,
                //     data: [
                //       {
                //         axisYType: "secondary",
                //         dataPoints: this.state.psar.indicator,
                //       }
                //     ]
                //   },

      ],
      navigator: {
        enabled: false
      },
      rangeSelector: {
        enabled: false
      }
    }
    : {}
    const containerProps = {
      width: "100%",
      height: "810px",
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
    let result = this.props.tf.prices,
        range = 60
    var dps1 = [], dps2 = [], dates = []
    for (var i = 0; i < result.length; i++) {
      var readableDate = result[i][0]*1000
      dates.push(readableDate)
      dps1.push({
        x: readableDate,
        y: result[i].slice(1, 5)
      });
      dps2.push({x: readableDate, y: result[i][6]})
    }
    let price = dps1.slice(-range),
        volume = dps2.slice(-range),
        bollingerBandSma = this.props.tf.bband.sma.slice(-range),
        bollingerBandBands = this.props.tf.bband.bands.slice(-range),
        bollingerBandPercent = this.props.tf.bband.percent.slice(-range),
        rsi = this.props.tf.rsi.values.slice(-range),
        psar = this.props.tf.psar.values.slice(-range),
        psarIndicator = this.props.tf.psar.actionIndicator.slice(-range),
        ichimokuCloud = {
          greenCloud: this.props.tf.ichimokuCloud.greenCloud,
          redCloud: this.props.tf.ichimokuCloud.redCloud,
          baseLine: this.props.tf.ichimokuCloud.baseLine,
          conversionLine: this.props.tf.ichimokuCloud.conversionLine,
          cloudIndicator: this.props.tf.ichimokuCloud.cloudIndicator,
          cloudActionIndicator: this.props.tf.ichimokuCloud.cloudActionIndicator,
          tkCrossIndicator: this.props.tf.ichimokuCloud.tkCrossIndicator,
          laggingSpan: this.props.tf.ichimokuCloud.laggingSpan,
          chikouActionIndicator: this.props.tf.ichimokuCloud.chikouActionIndicator,
          actionBaseLineIndicator: this.props.tf.ichimokuCloud.actionBaseLineIndicator,
          price: this.props.tf.ichimokuCloud.price
        },
        ema = this.props.tf.ema.values.slice(-range)


    this.setState({
      isLoaded: true,
      dataPoints1: dps1,
      dataPoints2: dps2,
      dates: dates,
      price,
      volume,
      ichimokuCloud: ichimokuCloud,
      bollingerBand: {sma: bollingerBandSma, bands: bollingerBandBands, percent: bollingerBandPercent},
      rsi: rsi,
      psar: {values: psar},
      ema:ema
    })
  }
}

export default Chart
