import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios import
import "../../styles/Running/Solo/SoloModeStart.css";

const Running = ({distance, setDistance, calories, setCalories, time, setTime}) => {
//   const [time, setTime] = useState(0); // 시간 상태
//   const [distance, setDistance] = useState(0); // 이동 거리 상태
  const [location, setLocation] = useState({ latitude: null, longitude: null }); // 현재 위치 상태
  const [isRunning, setIsRunning] = useState(true); // 타이머 상태 자동 시작
  const [error, setError] = useState(null); // 에러 메시지 상태
//   const [calories, setCalories] = useState(0); // 칼로리 상태
  const prevLocation = useRef({
    latitude: null,
    longitude: null,
    timestamp: null,
    speed: null,
  }); // 이전 위치 정보
  const timerRef = useRef(null); // 타이머 참조
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude, speed } = position.coords;
      const currentTime = Date.now();

      if (
        prevLocation.current.latitude !== null &&
        prevLocation.current.longitude !== null
      ) {
        const timeElapsed =
          (currentTime - prevLocation.current.timestamp) / 1000; // 초 단위로 변환
        const maxPossibleDistance =
          (prevLocation.current.speed || 0) * timeElapsed;
        const dist = calculateDistance(
          prevLocation.current.latitude,
          prevLocation.current.longitude,
          latitude,
          longitude
        );

        if (dist > maxPossibleDistance) {
          const correctedLocation = correctLocation(
            prevLocation.current.latitude,
            prevLocation.current.longitude,
            latitude,
            longitude,
            maxPossibleDistance
          );
          setDistance((prevDistance) => prevDistance + maxPossibleDistance);
          prevLocation.current = {
            ...correctedLocation,
            timestamp: currentTime,
            speed,
          };
          setLocation(correctedLocation);
        } else {
          setDistance((prevDistance) => prevDistance + dist);
          prevLocation.current = {
            latitude,
            longitude,
            timestamp: currentTime,
            speed,
          };
          setLocation({ latitude, longitude });
        }

        // 칼로리 계산 및 상태 업데이트
        const calculatedCalories = calculateCalories(distance);
        setCalories(calculatedCalories);
      } else {
        prevLocation.current = {
          latitude,
          longitude,
          timestamp: currentTime,
          speed,
        };
        setLocation({ latitude, longitude });
      }
    };

    const handleError = (error) => {
      setError(error.message);
    };

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };

    if (isRunning) {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
      const watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options
      );
      0;

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isRunning, distance]); // distance가 변경될 때마다 칼로리 계산

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1); // 매초 시간 증가
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const rad = Math.PI / 180;
    const φ1 = lat1 * rad;
    const φ2 = lat2 * rad;
    const Δφ = (lat2 - lat1) * rad;
    const Δλ = (lon2 - lon1) * rad;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const correctLocation = (lat1, lon1, lat2, lon2, maxDist) => {
    const dist = calculateDistance(lat1, lon1, lat2, lon2);
    const ratio = maxDist / dist;
    const correctedLat = lat1 + (lat2 - lat1) * ratio;
    const correctedLon = lon1 + (lon2 - lon1) * ratio;
    return { latitude: correctedLat, longitude: correctedLon };
  };

  const calculateCalories = (distance, weight = 70) => {
    // 간단한 계산 예시: 거리(킬로미터) * 체중(킬로그램) * 1.036 (칼로리/킬로그램/킬로미터)
    const distanceInKm = distance / 1000;
    const caloriesBurned = distanceInKm * weight * 1.036;
    return caloriesBurned;
  };

  return (
    <div className="SoloModeStart">
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <p>Elapsed Time: {formatTime(time)}</p>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Distance traveled: {distance.toFixed(2)} meters</p>
          <p>Calories burned: {calories.toFixed(2)} kcal</p>{" "}
        </>
      )}
    </div>
  );
};

export default Running;