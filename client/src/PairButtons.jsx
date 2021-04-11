import React, {Component} from 'react'

const PairButtons = (props) => {
  const pairs = ['xbt','eth','xrp','bch','ada', 'link','dash','eos',
                'ltc','dot','xtz','trx','usdc','algo','atom','etc',
                'fil','rep','omg','xlm','xmr','usdt','zec']
  return (
  <div className='buttons'>
    {pairs.map((pair, idx) => {
      return <button className='button is-dark'
                      onClick={() => props.onClick(pair)}>
        {pair.toUpperCase()}
      </button>}
    )}
  </div>
)
}

export default PairButtons
