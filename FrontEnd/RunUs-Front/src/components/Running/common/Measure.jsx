import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../hooks/UserContext";

const Measure = () => {
  const { userId: contextUserId, userData } = useContext(UserContext);
  const [position, setPosition] = useState(null);
  const [positionLast, setPositionLast] = useState(null);
  const [distance, setDistance] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [calories, setCalories] = useState(0);
  const [watchId, setWatchId] = useState(null);

  // 로컬스토리지에서 userId 가져오기
  const localStorageUserId = localStorage.getItem("userId");
  const userId = contextUserId || localStorageUserId;

  // 체중은 userData에서 가져오기
  const weight = userData ? userData.weight : 0;

  const getPosition = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const newPosition = pos.coords;
          if (positionLast) {
            const currentDistance = calculateDistance(
              positionLast.latitude,
              positionLast.longitude,
              newPosition.latitude,
              newPosition.longitude
            );
            setDistance((prevDistance) => prevDistance + currentDistance);
            setCalories(calculateCalories(distance, weight));
          }
          setPosition(newPosition);
          setPositionLast(newPosition);
        },
        (err) => {
          console.error("위치 정보를 가져오는 중 오류 발생:", err);
        },
        { timeout: 30000 }
      );
      setWatchId(id);
    } else {
      console.log("Geolocation을 지원하지 않는 브라우저입니다.");
    }
  };

  const startTracking = () => {
    setStartTime(new Date());
    getPosition();
  };

  const calculateElapsedTime = () => {
    if (startTime) {
      const endTime = new Date();
      const diffInSeconds = (endTime - startTime) / 1000;
      setElapsedTime(diffInSeconds);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const calculateCalories = (distance, weight) => {
    return distance * weight * 0.9;
  };

  const saveData = async () => {
    if (!startTime || !position) {
      alert("먼저 위치 정보를 가져오고 시작해야 합니다.");
      return;
    }

    if (!userId) {
      alert("로그인 상태가 확인되지 않습니다.");
      return;
    }

    const endTime = new Date();
    const elapsedTimeInSeconds = parseInt((endTime - startTime) / 1000);
    const currentCalories = calculateCalories(distance, weight);

    const dataToSend = {
      user_id: userId,
      distance: distance,
      time: elapsedTimeInSeconds,
      kcal: currentCalories,
      record_date: endTime.toISOString(),
    };

    console.log("Sending data:", dataToSend);

    try {
      const response = await axios.post("/api/v1/endsolo", dataToSend, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data);
      alert("데이터가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("데이터 저장 중 오류 발생:", error);
      alert("데이터 저장 중 오류가 발생했습니다.");
    }
  };

  const endTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    saveData();
    setStartTime(null);
  };

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        calculateElapsedTime();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime]);

  return (
    <div>
      <h1>측정 페이지</h1>
      <p>
        현재 위치:{" "}
        {position
          ? `위도 ${position.latitude}, 경도 ${position.longitude}`
          : "위치 정보를 가져오는 중..."}
      </p>
      <button onClick={getPosition}>위치 정보 가져오기</button>
      <br />
      <button onClick={startTracking}>측정 시작</button>
      <br />
      <button onClick={endTracking}>측정 종료</button>
      <br />
      <label>측정 시간 (초): {elapsedTime.toFixed(0)}</label>
      <br />
      <label>저장된 뛴 거리 (km): {distance.toFixed(2)}</label>
      <br />
      <label>저장된 소모 칼로리 (kcal): {calories.toFixed(2)}</label>
      <br />
    </div>
  );
};

export default Measure;
