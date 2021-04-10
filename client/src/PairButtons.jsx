import React, {Component} from 'react'

const PairButtons = (props) => {
  const pairs = ['atom', 'eth', 'ltc']
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
