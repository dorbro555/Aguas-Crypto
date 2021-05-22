
 function CreditsNotification(props){

   let resetTime = new Date(Date.parse(props.allowance.resetTime)).getTime()-Date.now()

   return(
     <div>
       {
         props.visible &&
         <div className='columns is-clickable' onClick={props.handleClick}>
           <div className="notification column is-2 has-background-info-light has-text-info-dark"  style={{position: 'fixed', top: '4%', right: 0}} >
            <button className="delete"></button>
              <div>
                <div>
                  Credits used: {props.allowance.current}
                </div>
                <div>
                  Credits remaining: {props.allowance.remaining}
                </div>
                <div>
                  Reset Time: {(resetTime / 1000 / 60).toFixed(0)} mins
                </div>
              </div>
          </div>
       </div>
      }
    </div>
   )
 }

 export default CreditsNotification
