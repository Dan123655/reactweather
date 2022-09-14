import React from "react";
import { useState } from "react";
import Result from "./Result";
import { useMemo } from "react";



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
  const [precip, setPrecip] = useState("");
  const [precip_in, setPrecip_in] = useState("");
  const [cache, cacheThis] = useState([]);
  const [windKm, setWindKm] = useState("")
  const [windM, setWindM] = useState("")
  const [feel, setFeel] = useState("")
  const [feelF, setFeelF] = useState("")
  const [pressure, setPressure] = useState("")
  const [pressureIn, setPressureIn] = useState("")
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
        setCity("cached " + cache[c_obj].c_loc);
        setTemp("cached " + cache[c_obj].c_temp + "°C");
        setWeatherCond("cached " + cache[c_obj].c_cond);
        setWindKm("cached " + cache[c_obj].c_wind_kph)
        setWindM("cached " + cache[c_obj].c_wind_mph)
        setFeel("cached " + cache[c_obj].feelslike_c)
        setFeelF("cached " + cache[c_obj].feelslike_f)
        setPressure("cached" + cache[c_obj].pressure_mb)
        setPressureIn("cached" + cache[c_obj].pressure_in)
        console.log("showing cached " + value + ", no API call needed");
      } else if (value === "") {
        setCity("");
        setTemp("");
        setWeatherCond("");
        setPrecip("");
        setPrecip_in("");
        setWindKm("")
        setWindM("")
        setFeel("")
        setFeelF("")
        setPressure("")
        setPressureIn("")
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
            setPrecip(data.current.precip_mm);
            setPrecip_in(data.current.precip_in);
            setWindKm(data.current.wind_kph)
            setWindM(data.current.wind_mph)
            setFeel(data.current.feelslike_c)
            setFeelF(data.current.feelslike_f)
            setPressure(data.current.pressure_mb)
            setPressureIn(data.current.pressure_in)
            
            
            cacheThis((cache) => [
              ...cache,
              {
                c_loc: data.location.name,
                c_temp: data.current.temp_c,
                c_cond: data.current.condition.text,
                c_precip: data.current.precip_mm,
                c_precip_in: data.current.precip_in,
                c_wind_kph: data.current.wind_kph,
                c_wind_mph: data.current.wind_mph,
                c_feelslike_c: data.current.feelslike_c,
                c_feelslike_f: data.current.feelslike_f,
                c_pressure_in: data.current.pressure_in,
                c_pressure_mb: data.current.pressure_mb
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
      <div className="city">London{city}</div>
        <div className="condition">Partly Cloudy{weatherCond}</div>
        <div className="temp">26C{temp}</div>
        <div className="wind">wind 6km/h{windKm}</div>
        <div className="precip">precipitation 6mm{precip}</div>
        <div className="feel">feels like25c{feel}</div>
        <div className="pressure">pressure: 1009 mb{pressure}</div>
      <div></div>
    </div>
  );
}

export default Input;
