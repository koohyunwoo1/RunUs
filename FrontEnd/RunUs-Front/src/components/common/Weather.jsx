import React, { useState, useEffect } from "react";
import "../../styles/Common/Weather.css";
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = "e9b0e3f0da29b0e93cc62e595098b7ca";
    const CITY = "Busan";
    // 여기서 백엔드에서 받은 지역 데이터를 넣으면 된다.
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          // 응답이 성공적으로 왔다면
          // true를 반환 아니면 false를 반환한다.
          throw new Error("Failed to fetch weather data");
        }
        return response.json();
        // true로 반환이 됐다면 json 데이터를 반환한다.
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
  // 의존성 빈 배열이므로, 컴포넌트가 처음 마운트 될때 한번만 실행된다.
  // 즉 , 여기에 들어갈 변수가 바뀔때마다 컴포넌트가 마운트됨

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
      {/* <p>강수량: {weatherData.rain["1h"]}</p> */}
    </div>
  );
};

export default Weather;
