import React, { useState, useEffect } from "react";
import "../../styles/Common/Weather.css";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
    const CITY = "Busan";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="Weather">
      <p>{weatherData.name}</p>
      <p>체감 온도: {weatherData.main.feels_like}°C</p>
      <p>현재 온도: {weatherData.main.temp}°C</p>
      <p>풍속: {weatherData.wind.speed} m/s</p>
    </div>
  );
};

export default Weather;
