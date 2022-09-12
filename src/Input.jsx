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
  const [cache, cacheThis] = useState([]);
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
        console.log("showing cached " + value + ", no API call needed");
      } else if (value === "") {
        setCity("");
        setTemp("");
        setWeatherCond("");
      } else {
        console.log("after 1 sec, got value, fetching...");
        var apiKey = "fb85ebfe704544bf97a23953221907";
        await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${value}&aqi=no`
        )
          .then((response) => response.json())
          .then((data) => {
            setCity(data.location.name);
            setTemp(data.current.temp_c + "°C");
            setWeatherCond(data.current.condition.text);
            cacheThis((cache) => [
              ...cache,
              {
                c_loc: data.location.name,
                c_temp: data.current.temp_c,
                c_cond: data.current.condition.text,
              },
            ]);
            console.log(data.location.name + " " + data.current.temp_c + "°C");
            console.log("cached: " + (parseInt(cache.length) + 1));
          })
  
          .catch((err) => {
            console.log(`fetch err =>`);
          });
      }
    }
    return debounce(getData)
  },[]);


  return (
    <div className="maindDiv">
      <div className="input">
        <input
          type="text"
          className="inputValue"
          placeholder="Enter a city"
          onChange={memeTime}
        />
        <Result cond={weatherCond} cachedLoc={city} temp={temp} />
      </div>
      <div></div>
    </div>
  );
}

export default Input;
