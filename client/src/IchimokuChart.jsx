import React, { Component } from 'react'
import CanvasJSReact from './assets/canvasjs.stock.react'
var CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;
var CanvasJS = CanvasJSReact.CanvasJS

class IchimokuChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const showIchimoku = true
    const range = 60
    const dataPointMinWidth = 9
    const indicatorHeight = 55
    const ichimokuCloud = this.props.ichimokuCloud

    const optionsIchimoku = ichimokuCloud ? {
      theme: "dark2",
      height:275,
      charts: [
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
              dataPoints: ichimokuCloud.cloudIndicator,
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
              dataPoints: ichimokuCloud.cloudActionIndicator,
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
                dataPoints: ichimokuCloud.tkCrossIndicator,
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
                dataPoints: ichimokuCloud.chikouActionIndicator,
              }
            ]
        },
        {
            title:{
              text: "Action/Base"
            },
            axisX: {
              labelFormatter: function (e) {
				            return CanvasJS.formatDate( e.value, "DD MMM HH:mm");
              },
            },
            height: indicatorHeight+14,
            axisY2: {
              maximum: 1
            },
            dataPointMinWidth: dataPointMinWidth,
            data: [
              {
                axisYType: "secondary",
                xValueType: "dateTime",
                dataPoints: ichimokuCloud.actionBaseLineIndicator,
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
      height: "275px",
      margin: "auto"
    };
    return (
          <div>
            <CanvasJSStockChart containerProps={containerProps} options = {optionsIchimoku}
                /* onRef = {ref => this.chart = ref} */
            />
          </div>
    );
  }
}

export default IchimokuChart
