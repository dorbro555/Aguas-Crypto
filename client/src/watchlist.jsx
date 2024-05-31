import React from 'react'

const WatchList  = (props) => {
const pairs = ['btc','eth','xrp','bch','ada', 'link','dash','eos',
              'ltc','dot','xtz','trx','usdc','algo','atom','etc',
              'fil','rep','omg','xlm','xmr','usdt','zec', 'doge']

  return(
    <div className='has-background-dark'>
        <div className='level is-mobile mx-2'>
          <div className='level-left'>
            <div className='level-item'>
              <h4 className='title is-4 has-text-white is-unselectable'>Watchlist</h4>
            </div>
          </div>
          <div className='level-right'>
            <div className='level-item'>
              <span className='icon is-clickable' onClick={props.close}>
                <i className="fas fa-window-close has-text-white"></i>
              </span>
            </div>
          </div>
        </div>
      <div className='buttons are-small has-text-white'>
        {pairs.map((pair, idx) => {
          return <button className='button is-dark has-text-white'
                          onClick={() => props.onClick(pair)}
                          key={idx}>
            {pair.toUpperCase()}
                </button>}
        )}
      </div>
    </div>
  )
}

export default WatchList
