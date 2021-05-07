import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
import {formateTimeFrame} from './utils' ;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;


class LineChart extends Component {
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
    const showIchimoku = true
    const dataPointMinWidth = 6
    const interactivityEnabled = false
    const lineThickness = 1.2
    const options = this.state.isLoaded ? {
      theme: "dark2",
      // title:{
      //   text: formateTimeFrame(this.props.timeframe) + ` ${this.props.activePair.toUpperCase()} Price`
      // },
      subtitles: [{
        text: formateTimeFrame(this.props.timeframe) + ` ${this.props.activePair.toUpperCase()} Price: $${this.props.tf.prices[this.props.tf.prices.length-1][4]}`
      }],
      height:485,
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
          interactivityEnabled: interactivityEnabled,
          dataPointMinWidth: 2,
          data: [{
            name: "Price (in USD)",
            yValueFormatString: "$#,###.##",
            xValueFormatString: "MMM DD HH:mm",
            xValueType: "dateTime",
            type: "candlestick",
            axisYType: "secondary",
            risingColor: '#000000',
            color:'#ff5555',
            dataPoints : this.state.price
          },
          {
            name: "Conversion Line",
            type: "line",
            lineThickness: lineThickness,
            visible: showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            color: '#d5589d',
            dataPoints : this.state.ichimokuCloud.conversionLine
          },
          {
            name: "Base Line",
            type: "line",
            lineThickness: lineThickness,
            visible: showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            color: '#f59a38',
            dataPoints : this.state.ichimokuCloud.baseLine
          },
          {
            name: "Chikou",
            type: "line",
            lineThickness: lineThickness,
            visible: showIchimoku,
            axisYType: "secondary",
            color: '#725ce5',
            markerType: 'none',
            dataPoints : this.state.ichimokuCloud.laggingSpan
          },
          {
            name: "200 EMA",
            type: "line",
            lineThickness: lineThickness,
            visible: showIchimoku,
            axisYType: "secondary",
            color: '#7cf8e0',
            markerType: 'none',
            dataPoints : this.state.ema
          },
          {
            name: 'Senkou',
            type: "rangeSplineArea",
            lineThickness: lineThickness,
            visible: showIchimoku,
            axisYType: 'secondary',
            markerType: 'none',
            color: '#07df3d',
            dataPoints: this.state.ichimokuCloud.greenCloud
          },
          {
            name: 'Red Senkou',
            type: "rangeSplineArea",
            lineThickness: lineThickness,
            visible: showIchimoku,
            axisYType: 'secondary',
            markerType: 'none',
            color: '#f00000',
            dataPoints: this.state.ichimokuCloud.redCloud
          },
          {
            name: 'Bollinger Band',
            type: "rangeSplineArea",
            lineThickness: lineThickness,
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
            dataPoints : this.state.psar
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

            height: 150,
            axisY2: {
              maximum: 100,
              minimum: 0,
              title:"%B",
            },
            dataPointMinWidth: dataPointMinWidth,
            interactivityEnabled: interactivityEnabled,
            data: [
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                color: '#ffff00',
                lineDashType: 'shortDash',
                lineThickness: lineThickness,
                maximum: 100,
                dataPoints: this.state.bollingerBand.percent,
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#d5589d',
                maximum: 100,
                dataPoints: this.state.conversionLinePercent,
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#f59a38',
                maximum: 100,
                dataPoints: this.state.baseLinePercent,
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#07df3d',
                maximum: 100,
                dataPoints: this.state.ichimokuSpanAPercent,
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#f00000',
                maximum: 100,
                dataPoints: this.state.ichimokuSpanBPercent,
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: 0.1,
                markerSize: 4,
                markerType: 'circle',
                color: '#81c6f4',
                maximum: 100,
                dataPoints: this.state.psarPercent,
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#7cf8e0',
                maximum: 100,
                dataPoints: this.state.emaPercent200,
              },
            ]
        },
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
      height: "485px",
      margin: "auto"
    };
    return (
          <div>
            {
              this.state.isLoaded &&
                <CanvasJSStockChart containerProps={containerProps} options = {options}
                  /* onRef = {ref => this.chart = ref} */
                />
            }
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
        y: result[i].slice(1, 5),
        color: result[i][1] < result[i][4] ? '#50fa7b' : '#ff5555'
      });
      dps2.push({x: readableDate, y: result[i][6]})
    }
    let price = dps1.slice(-range),
        volume = dps2.slice(-range),
        bollingerBandSma = this.props.tf.bband.sma.slice(-range),
        bollingerBandBands = this.props.tf.bband.bands.slice(-range),
        bollingerBandPercent = this.props.tf.bband.percent.slice(-range),
        psar = this.props.tf.psar.values.slice(-range),
        ichimokuCloud = this.props.tf.ichimokuCloud,
        ema = this.props.tf.ema['200'].values.slice(-range),
        conversionLinePercent = this.props.tf.percentages.conversionLinePercent.slice(-range),
        baseLinePercent = this.props.tf.percentages.baseLinePercent.slice(-range),
        ichimokuSpanAPercent = this.props.tf.percentages.ichimokuSpanAPercent.slice(-range),
        ichimokuSpanBPercent = this.props.tf.percentages.ichimokuSpanBPercent.slice(-range),
        psarPercent = this.props.tf.percentages.psarPercent.slice(-range),
        emaPercent200 = this.props.tf.percentages.emaPercent200.slice(-range)

    this.setState({
      isLoaded: true,
      dataPoints1: dps1,
      dataPoints2: dps2,
      dates: dates,
      price,
      volume,
      ichimokuCloud: ichimokuCloud,
      bollingerBand: {sma: bollingerBandSma, bands: bollingerBandBands, percent: bollingerBandPercent},
      psar: psar,
      ema:ema,
      conversionLinePercent: conversionLinePercent,
      baseLinePercent: baseLinePercent,
      ichimokuSpanAPercent: ichimokuSpanAPercent,
      ichimokuSpanBPercent: ichimokuSpanBPercent,
      psarPercent: psarPercent,
      emaPercent200: emaPercent200,
    })
  }
}

export default LineChart
