import React from 'react'
function Result(props) {
  return (
    <div>
        <div className="display">
        <h1 className="location">{props.cachedLoc}</h1>
        <p className="description">{props.cond}</p>
            <p className="temp">{props.temp}</p>
    </div>

    </div>
  )
}

export default Result
