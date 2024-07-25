import axios from "axios";
import React, { useState, useEffect } from "react";

const Measure = () => {
  const [position, setPosition] = useState(null);
  // 사용자의 현재 위치 정보
  const [positionLast, setPositionLast] = useState(null);
  // 사용자의 이전 위치 정보
  const [distance, setDistance] = useState(0);
  // 뛴 거리
  const [weight, setWeight] = useState(0);
  // 몸무게
  const [startTime, setStartTime] = useState(null);
  // startTime을 null로 설정해서 startTime이 시작이 되면 useEffect 발생
  const [elapsedTime, setElapsedTime] = useState(0);
  // 사용자가 측정한 시간을 초 단위로
  const [calories, setCalories] = useState(10);
  // 칼로리

  // 위치 정보를 가져오는 함수
  const getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos.coords);
          setPositionLast(pos.coords);
        },
        (err) => {
          console.error("위치 정보를 가져오는 중 오류 발생:", err);
        }
      );
    } else {
      console.log("Geolocation을 지원하지 않는 브라우저입니다.");
    }
  };

  // 시작 시간 기록
  const startTracking = () => {
    setStartTime(new Date());
  };

  // 측정 시간 계산 함수 (초 단위)
  const calculateElapsedTime = () => {
    if (startTime) {
      const endTime = new Date();
      const diffInSeconds = (endTime - startTime) / 1000; // 밀리초를 초 단위로 변환
      setElapsedTime(diffInSeconds);
    }
  };

  // 뛴 거리 계산 함수 (Haversine 공식 사용)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반지름 (단위: km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 거리 (단위: km)
    return distance;
  };

  // 칼로리 계산 함수
  const calculateCalories = (distance, weight) => {
    // 간단한 예제로, 칼로리 = 뛴 거리(km) * 체중(kg) * 0.9 (단순 예시)
    return distance * weight * 0.9;
  };

  // 저장 버튼 클릭 시 실행될 함수
  const saveData = async () => {
    if (!startTime || !position) {
      alert("먼저 위치 정보를 가져오고 시작해야 합니다.");
      return;
    }

    const endTime = new Date();
    console.log(endTime);
    const elapsedTimeInSeconds = parseInt((endTime - startTime) / 1000);
    console.log(elapsedTimeInSeconds);
    // 끝난 시간

    const currentDistance = calculateDistance(
      positionLast.latitude,
      positionLast.longitude,
      position.latitude,
      position.longitude
    );
    console.log("km", currentDistance);
    console.log("km", position.latitude);
    console.log("km", position.longitude);
    console.log("km", positionLast.longitude);
    console.log("km", positionLast.latitude);

    const currentCalories = calculateCalories(currentDistance, weight);
    console.log("kcal", currentCalories);

    // 백엔드로 데이터 전송하는 코드
    try {
      const response = await axios.post("http/your-ba:/ckend-url/save", {
        distance: currentDistance,
        time: elapsedTimeInSeconds,
        calories: currentCalories,
        latitude: position.latitude,
        longitude: position.longitude,
      });
      console.log(response.data);
      alert("데이터가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("데이터 저장 중 오류 발생:", error);
      alert("데이터 저장 중 오류가 발생했습니다.");
    }
  };

  // 측정 시간을 매 초마다 업데이트 하는 기능
  useEffect(() => {
    if (startTime) {
      // startTime이 존재할 때 (측정이 시작된 상태)
      const timer = setInterval(() => {
        calculateElapsedTime();
      }, 1000); // 1 초마다 측정 시간 업데이트

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
      <label>체중 (kg):</label>
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(parseInt(e.target.value))}
      />
      <br />
      <label>측정 시간 (초): {elapsedTime.toFixed(0)}</label>
      <br />
      <label>저장된 뛴 거리 (km): {distance.toFixed(2)}</label>
      <br />
      <label>저장된 소모 칼로리 (kcal): {calories.toFixed(2)}</label>
      <br />
      <button onClick={saveData}>저장</button>
    </div>
  );
};

export default Measure;
