import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
import {formateTimeFrame} from './utils' ;
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
const longColor = '#73d963'
const shortColor = '#a43d68'
const darkColor = '#2a2438'
const textColor = '#dc9651'

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
      ema: {},
      indicators: {},
      showIchimoku: this.props.showIchimoku,
      isLoaded: false
    };

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(){
    this.setState({showIchimoku: !this.state.showIchimoku})
  }

  render() {
    const showIchimoku = this.state.showIchimoku
    const dataPointMinWidth = 6
    const interactivityEnabled = false
    const lineThickness = 1.2
    const options = this.state.isLoaded ? {
      backgroundColor: darkColor,
      // title:{
      //   text: formateTimeFrame(this.props.timeframe) + ` ${this.props.activePair.toUpperCase()} Price`
      // },
      subtitles: [{
        text: formateTimeFrame(this.props.timeframe) + ` ${this.props.activePair.toUpperCase()} Price: $${this.props.tf.prices[this.props.tf.prices.length-1][4]}`,
        fontColor: textColor,
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
            title: "",
            labelFontColor: textColor,
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
            risingColor: darkColor,
            color:shortColor,
            dataPoints : this.state.price
          },
          {
            name: "Conversion Line",
            type: "line",
            lineThickness: lineThickness,
            visible:this.props.showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            color: '#d5589d',
            dataPoints : this.state.ichimokuCloud.conversionLine
          },
          {
            name: "Base Line",
            type: "line",
            lineThickness: lineThickness,
            visible:this.props.showIchimoku,
            axisYType: "secondary",
            markerType: 'none',
            color: '#f59a38',
            dataPoints : this.state.ichimokuCloud.baseLine
          },
          {
            name: "Chikou",
            type: "line",
            lineThickness: lineThickness,
            visible:this.props.showIchimoku,
            axisYType: "secondary",
            color: '#725ce5',
            markerType: 'none',
            dataPoints : this.state.ichimokuCloud.laggingSpan
          },
          {
            name: "EMA 21",
            type: "line",
            lineThickness: lineThickness,
            visible: !this.props.showIchimoku,
            axisYType: "secondary",
            color: '#0d8ce3',
            markerType: 'none',
            dataPoints : this.state.ema['21']
          },
          {
            name: "EMA 50",
            type: "line",
            lineThickness: lineThickness,
            visible: !this.props.showIchimoku,
            axisYType: "secondary",
            color: '#b1adeb',
            markerType: 'none',
            dataPoints : this.state.ema['50']
          },
          {
            name: "EMA 100",
            type: "line",
            lineThickness: lineThickness,
            visible: !this.props.showIchimoku,
            axisYType: "secondary",
            color: '#df9fd7',
            markerType: 'none',
            dataPoints : this.state.ema['100']
          },
          {
            name: "EMA 200",
            type: "line",
            lineThickness: lineThickness,
            axisYType: "secondary",
            color: '#7cf8e0',
            markerType: 'none',
            dataPoints : this.state.ema['200']
          },
          {
            name: 'Senkou',
            type: "rangeSplineArea",
            lineThickness: lineThickness,
            axisYType: 'secondary',
            markerType: 'none',
            color: '#07df3d',
            dataPoints: this.state.ichimokuCloud.greenCloud
          },
          {
            name: 'Red Senkou',
            type: "rangeSplineArea",
            lineThickness: lineThickness,
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
            color: '#2d6086',
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
            axisX: {
              labelFontColor: textColor
            },
            axisY2: {
              maximum: 100,
              minimum: 0,
              title:"%B",
              titleFontColor: textColor,
              labelFontColor: textColor
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
                visible:this.props.showIchimoku,
                maximum: 100,
                dataPoints: this.state.conversionLinePercent,
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#f59a38',
                visible:this.props.showIchimoku,
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
                color: '#0d8ce3',
                visible: !this.props.showIchimoku,
                maximum: 100,
                dataPoints: this.state.emaPercent['21'],
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#b1adeb',
                visible: !this.props.showIchimoku,
                maximum: 100,
                dataPoints: this.state.emaPercent['50'],
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#df9fd7',
                visible: !this.props.showIchimoku,
                maximum: 100,
                dataPoints: this.state.emaPercent['100'],
              },
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                type:'line',
                lineThickness: lineThickness,
                color: '#7cf8e0',
                maximum: 100,
                dataPoints: this.state.emaPercent['200'],
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
        color: result[i][1] < result[i][4] ? longColor : shortColor
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
        ema21 = this.props.tf.ema['21'].slice(-range),
        ema50 = this.props.tf.ema['50'].slice(-range),
        ema100 = this.props.tf.ema['100'].slice(-range),
        ema200 = this.props.tf.ema['200'].slice(-range),
        conversionLinePercent = this.props.tf.percentages.conversionLinePercent.slice(-range),
        baseLinePercent = this.props.tf.percentages.baseLinePercent.slice(-range),
        ichimokuSpanAPercent = this.props.tf.percentages.ichimokuSpanAPercent.slice(-range),
        ichimokuSpanBPercent = this.props.tf.percentages.ichimokuSpanBPercent.slice(-range),
        psarPercent = this.props.tf.percentages.psarPercent.slice(-range),
        emaPercent21 = this.props.tf.percentages.emaPercent21.slice(-range),
        emaPercent50 = this.props.tf.percentages.emaPercent50.slice(-range),
        emaPercent100 = this.props.tf.percentages.emaPercent100.slice(-range),
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
      ema:{
        21: ema21,
        50: ema50,
        100: ema100,
        200: ema200
      },
      conversionLinePercent: conversionLinePercent,
      baseLinePercent: baseLinePercent,
      ichimokuSpanAPercent: ichimokuSpanAPercent,
      ichimokuSpanBPercent: ichimokuSpanBPercent,
      psarPercent: psarPercent,
      emaPercent: {
        21: emaPercent21,
        50: emaPercent50,
        100: emaPercent100,
        200: emaPercent200
      }
    })
  }
}

export default LineChart
