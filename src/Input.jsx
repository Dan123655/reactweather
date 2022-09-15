import React from "react";
import { useState } from "react";
import { useMemo } from "react";
import{BsCloudLightningRain, BsCloudRain, BsMoonStars} from 'react-icons/bs';
import{AiOutlineCloud} from 'react-icons/ai';
import{WiFog,WiNightAltRainMix,WiNightAltCloudy} from 'react-icons/wi';
import{MdOutlineWbSunny} from 'react-icons/md';






const debounce = (func) => {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, 1000);
  };
};

function Input() {
  
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState("");
  const [weatherCond, setWeatherCond] = useState("");
  const [precip_mm, setPrecip_mm] = useState("");
  const [precip_in, setPrecip_in] = useState("");
  const [cache, cacheThis] = useState([]);
  const [windKm, setWindKm] = useState("")
  const [windM, setWindM] = useState("")
  const [feel, setFeel] = useState("")
  const [feelF, setFeelF] = useState("")
  const [pressure, setPressure] = useState("")
  const [pressureIn, setPressureIn] = useState("")
  const [day, setDay] = useState("")
  
  const properIcon =()=>{
  
    if(day&&weatherCond.toLowerCase().includes('rain')) {return (<BsCloudRain></BsCloudRain>) } 
  else if(!day&&weatherCond.toLowerCase().includes('rain')){return (<WiNightAltRainMix></WiNightAltRainMix>)}
  else if(!day&&weatherCond.toLowerCase().includes('sunny')){return(<BsMoonStars></BsMoonStars>)}
  else if(!day&&weatherCond.toLowerCase().includes('clear')){return(<BsMoonStars></BsMoonStars>)}

  else if(!day&&weatherCond.toLowerCase().includes('cloud')){return(<WiNightAltCloudy></WiNightAltCloudy>)}
  else if(!day&&weatherCond.toLowerCase().includes('mist')){return(<WiNightAltCloudy></WiNightAltCloudy>)}
  else if(!day&&weatherCond.toLowerCase().includes('fog')){return(<WiNightAltCloudy></WiNightAltCloudy>)}
  else if(!day&&weatherCond.toLowerCase().includes('overcast')){return(<WiNightAltCloudy></WiNightAltCloudy>)}
  

  else if(day&&weatherCond.toLowerCase().includes('cloud')){return(<AiOutlineCloud></AiOutlineCloud>)}
  else if(day&&weatherCond.toLowerCase().includes('mist')){return(<AiOutlineCloud></AiOutlineCloud>)}
  else if(day&&weatherCond.toLowerCase().includes('fog')){return(<AiOutlineCloud></AiOutlineCloud>)}
  else if(day&&weatherCond.toLowerCase().includes('overcast')){return(<AiOutlineCloud></AiOutlineCloud>)}
  
  else if(day&&weatherCond.toLowerCase().includes('sunny')){return(<MdOutlineWbSunny></MdOutlineWbSunny>)}
  else if(day&&weatherCond.toLowerCase().includes('clear')){return(<MdOutlineWbSunny></MdOutlineWbSunny>)}
  else{return}
         
  }



  if (cache.length > 3) {
    cache.shift();
    console.log("cache is full, removing oldest item");
  }

  const memeTime = useMemo(()=>{
    async function getData(event) {
      const { value } = event.target;
      if (
        cache.length > 0 &&
        cache.filter(
          (obj) => obj.c_loc.toLowerCase() === event.target.value.toLowerCase()
        ).length > 0
      ) {
        var c_obj = cache
          .map((obj) => {
            return obj.c_loc.toLowerCase();
          })
          .indexOf(event.target.value.toLowerCase());
        setCity("*" + cache[c_obj].c_loc);
        setTemp("*" + cache[c_obj].c_temp + "°C");
        setWeatherCond("*" + cache[c_obj].c_cond);
        setWindKm("*" + cache[c_obj].c_wind_kph)
        setWindM("*" + cache[c_obj].c_wind_mph)
        setFeel("*" + cache[c_obj].c_feelslike_c)
        setFeelF("*" + cache[c_obj].c_feelslike_f)
        setPressure("*" + cache[c_obj].c_pressure_mb)
        setPressureIn("*" + cache[c_obj].c_pressure_in)
        setPrecip_mm("*" + cache[c_obj].c_precip_mm)
        setPrecip_in("*" + cache[c_obj].c_precip_in)
        setDay("*" + cache[c_obj].c_is_day)
        console.log("showing cached " + value + ", no API call needed");
      } else if (value === "") {
        setCity("");
        setTemp("");
        setWeatherCond("");
        setPrecip_mm("");
        setPrecip_in("");
        setWindKm("")
        setWindM("")
        setFeel("")
        setFeelF("")
        setPressure("")
        setPressureIn("")
        setDay("")
      } else {
        console.log("after 1 sec, got value, fetching...");
        var apiKey = "fb85ebfe704544bf97a23953221907";
        await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${value}&aqi=no`
        )
        // `https://api.weatherapi.com/v1/current.json?key="fb85ebfe704544bf97a23953221907"&q="London"&aqi=no`
          .then((response) => response.json())
          .then((data) => {
            setCity(data.location.name);
            setTemp(data.current.temp_c + "°C");
            setWeatherCond(data.current.condition.text);
            setPrecip_mm(data.current.precip_mm.toString());
            setPrecip_in(data.current.precip_in);
            setWindKm(data.current.wind_kph.toString())
            setWindM(data.current.wind_mph)
            setFeel(data.current.feelslike_c)
            setFeelF(data.current.feelslike_f)
            setPressure(data.current.pressure_mb)
            setPressureIn(data.current.pressure_in)
            setDay(data.current.is_day===0?false:true)
            
            
            cacheThis((cache) => [
              ...cache,
              {
                c_loc: data.location.name,
                c_temp: data.current.temp_c,
                c_cond: data.current.condition.text,
                c_precip_mm: data.current.precip_mm.toString(),
                c_precip_in: data.current.precip_in,
                c_wind_kph: data.current.wind_kph.toString(),
                c_wind_mph: data.current.wind_mph,
                c_feelslike_c: data.current.feelslike_c,
                c_feelslike_f: data.current.feelslike_f,
                c_pressure_in: data.current.pressure_in,
                c_pressure_mb: data.current.pressure_mb,
                c_is_day: data.current.is_day===0?false:true
              }
            ]);
            console.log(data.location.name + " " + data.current.temp_c + "°C");
            
            console.log("cached: " + (parseInt(cache.length) + 1));
          })
  
          .catch((err) => {
            console.log(`fetch err =>`);
          });
      }
    }
    console.log(cache)
    return debounce(getData)
  },[cache]);




  return (
    <div className="grid-container">
      <div className="input">
        <input
          type="text"
          className="inputValue"
          placeholder="Enter a city"
          onChange={memeTime}
        />
      </div>
      <div className="city">{city}</div>
        <div className="condition">{properIcon(weatherCond)}  {weatherCond}</div>
        <div className="temp">{temp?temp:""}</div>
        <div className="wind">{windKm?windKm + "km/h wind":""}</div>
        <div className="precip">{precip_mm?"precip: " + precip_mm:""}</div>
        <div className="feel">{feel?"feels like " +feel+"C":""}</div>
        <div className="pressure">{pressure?"AP: "+pressure+" mb":""}</div>
      <div></div>
    </div>
  );
}

export default Input;
