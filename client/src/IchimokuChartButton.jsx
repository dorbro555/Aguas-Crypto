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
        <div className='level is-mobile is-black has-text-white mb-1 has-text-weight-medium' onClick={this.handleClick}>
          Ichimoku Clouds
          <div className='buttons are-small'>
            <span className={ichimokuCloud.cloudIndicator[ichimokuCloud.cloudIndicator.length-1].color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}></span>
            <span className={ichimokuCloud.cloudActionIndicator[ichimokuCloud.cloudActionIndicator.length-1].color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}></span>
            <span className={ichimokuCloud.tkCrossIndicator[ichimokuCloud.tkCrossIndicator.length-1].color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}></span>
            <span className={ichimokuCloud.cloudIndicator[ichimokuCloud.cloudIndicator.length-1].color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}></span>
            <span className={ichimokuCloud.cloudIndicator[ichimokuCloud.cloudIndicator.length-1].color === '#07df3d'? 'button is-rounded is-success':'button is-rounded is-danger'}></span>
          </div>

        </div>
        {
          this.state.toggleOn &&
          <IchimokuChart ichimokuCloud={ichimokuCloud}/>
        }
      </div>
    )
  }
}

export default IchimokuChartButton
