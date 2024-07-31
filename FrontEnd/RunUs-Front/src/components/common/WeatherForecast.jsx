import React, { useState, useEffect } from "react";
import "../../styles/Common/Weather.css";

const WeatherForecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const weatherDescriptionMap = {
    "clear sky": "맑음",
    "few clouds": "약간의 구름",
    "scattered clouds": "흐림",
    "broken clouds": "구름이 많이 낀",
    mist: "안개",
    fog: "안개가 짙음",
    "light rain": "비",
    "moderate rain": "비가 오고 있음",
    "heavy rain": "강한 비",
    showers: "소나기",
    "heavy showers": "소나기가 오고 있음",
    thunderstorm: "천둥",
    snow: "눈",
    "light snow": "가벼운 눈",
    blizzard: "눈보라",
    "thunderstorm with rain": "뇌우와 비",
    "thunderstorm with snow": "뇌우와 눈",
  };

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_APP_WEATHER_API_KEY;
    const CITY = "Busan";
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`;

    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        return response.json();
      })
      .then((data) => {
        const dailyForecasts = processDailyForecasts(data.list);
        setForecastData(dailyForecasts);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const processDailyForecasts = (forecastList) => {
    const dailyForecasts = [];
    const dayMap = {};

    forecastList.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const dayKey = `${date.getMonth() + 1}/${date.getDate()}`;

      if (!dayMap[dayKey]) {
        dayMap[dayKey] = {
          date: `${date.getMonth() + 1}월 ${date.getDate()}일`,
          tempMin: forecast.main.temp_min,
          tempMax: forecast.main.temp_max,
          description:
            weatherDescriptionMap[forecast.weather[0].description] ||
            forecast.weather[0].description,
          icon: forecast.weather[0].icon,
        };
      } else {
        dayMap[dayKey].tempMin = Math.min(
          dayMap[dayKey].tempMin,
          forecast.main.temp_min
        );
        dayMap[dayKey].tempMax = Math.max(
          dayMap[dayKey].tempMax,
          forecast.main.temp_max
        );
      }
    });

    for (const key in dayMap) {
      dailyForecasts.push(dayMap[key]);
    }

    return dailyForecasts;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="WeatherForecast">
      {forecastData.map((day, index) => (
        <div key={index} className="ForecastItem">
          <h3>{day.date}</h3>
          <p>최저 온도: {Math.round(day.tempMin)}°C</p>
          <p>최고 온도: {Math.round(day.tempMax)}°C</p>
          <p>{day.description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt={day.description}
          />
        </div>
      ))}
    </div>
  );
};

export default WeatherForecast;
