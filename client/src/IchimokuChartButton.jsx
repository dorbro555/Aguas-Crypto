import React, {Component} from 'react'
import IchimokuChart from './IchimokuChart'

class IchimokuChartButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      toggleOn: false
    }
    this.handleClick = this.handleClick.bind(this)

  }

  handleClick(){
    this.setState({toggleOn: !this.state.toggleOn})
  }

  render(){
    let ichimokuCloud = this.props.tf.ichimokuCloud
    return(
      <div>
        <div className='button is-black is-fullwidth' onClick={this.handleClick}>
          Ichimoku Clouds
          <span className={ichimokuCloud.cloudIndicator[ichimokuCloud.cloudIndicator.length-1].color === '#07df3d'? 'button is-success':'button is-danger'}></span>
          <span className={ichimokuCloud.cloudActionIndicator[ichimokuCloud.cloudActionIndicator.length-1].color === '#07df3d'? 'button is-success':'button is-danger'}></span>
          <span className={ichimokuCloud.tkCrossIndicator[ichimokuCloud.tkCrossIndicator.length-1].color === '#07df3d'? 'button is-success':'button is-danger'}></span>
          <span className={ichimokuCloud.cloudIndicator[ichimokuCloud.cloudIndicator.length-1].color === '#07df3d'? 'button is-success':'button is-danger'}></span>
          <span className={ichimokuCloud.cloudIndicator[ichimokuCloud.cloudIndicator.length-1].color === '#07df3d'? 'button is-success':'button is-danger'}></span>

        </div>
        {
          this.state.toggleOn &&
          <IchimokuChart ichimokuCloud={ichimokuCloud} timeframe={this.props.timeframe} activePair={this.props.activePair}/>
        }
      </div>
    )
  }
}

export default IchimokuChartButton
