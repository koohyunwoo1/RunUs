import React, { useState, useEffect } from "react";
import "../../styles/Common/Weather.css";
import WeatherForecast from "./WeatherForecast";
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
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

  const cityNameMap = {
    Busan: "부산광역시",
    Seoul: "서울특별시",
    Incheon: "인천광역시",
    Daegu: "대구광역시",
    Gwangju: "광주광역시",
    Daejeon: "대전광역시",
    Ulsan: "울산광역시",
    Jeju: "제주특별자치도",
  };

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

  const iconCode = weatherData.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const temperature = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);

  const description =
    weatherDescriptionMap[weatherData.weather[0].description] ||
    weatherData.weather[0].description;
  const cityName = cityNameMap[weatherData.name] || weatherData.name;

  return (
    <div>
      {/* <h2 style={{ textAlign: "center", margin: "10px 0" }}>나의 위치</h2> */}
      <h4 style={{ textAlign: "center", margin: "5px 0" }}>{cityName}</h4>
      <h2 style={{ textAlign: "center", margin: "10px 0" }}>{temperature}°C</h2>
      <div className="Weather">
        <img
          style={{ width: "60px", height: "60px" }}
          src={iconUrl}
          alt={description}
        />
        <p>{description}</p>
        <p>체감 온도: {feelsLike}°C</p>
        <p>풍속: {weatherData.wind.speed} m/s</p>
      </div>
      <WeatherForecast />
    </div>
  );
};

export default Weather;
