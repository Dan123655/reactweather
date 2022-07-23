import React from 'react'
import{useState} from 'react'
import Result from './Result'
import{useCallback} from 'react'

function Input(){
  
  const[weatherData, setWeatherData]=useState()
  const[input, setInput]=useState('')
  const[city,setCity]=useState('')
  const[temp,setTemp]=useState('')
  const[weatherCond,setWeatherCond]=useState('')


  const debounce = (func)=>{
    
    let timer;
    return function(...args){
      const context=this;
      if(timer)clearTimeout(timer)
      timer=setTimeout(()=>{timer=null;func.apply(context,args)},500)}}
        const memeTime=useCallback(debounce(getData))

 



async function getData(event){
const {value} = event.target;
  console.log('recieved value, fetching...')  
      var apiKey='fb85ebfe704544bf97a23953221907'
          await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${value}&aqi=no`)
          .then(response => response.json())
          .then(data => {setWeatherData(data)
            // setWeatherData(data);
            console.log(data.current.condition.text)
            setCity(data.location.name)
            setTemp(data.current.temp_c + '°C')
            setWeatherCond(data.current.condition.text)
            })
            
  
          .catch(err=>{console.log(`fetch err =>`);});
  }





  




  return (<>
    <div className="input">
        <input 
        type="text" 
        className="inputValue" 
        placeholder="Enter a city" 
        onChange={memeTime}
        
        />
        <Result 
        cond={weatherCond}
        cache={city}
        temp={temp}
/>
    </div>
    <div>
        
    </div>
    </>
  )
}

export default Input
