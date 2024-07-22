// ReverseGeolocation.jsx

import React, { useState, useCallback } from 'react';
import axios from 'axios';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

// 역지오코딩 데이터를 가져오는 함수
const fetchReverseGeocoded = async (latitude, longitude) => {
  const reverseGeocoded = await axios.get(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );
  return reverseGeocoded.data;
}

// 위치 데이터를 가져오고 화면에 표시하는 React 컴포넌트
const ReverseGeolocation = () => {
  const [locationData, setLocationData] = useState(null); // 위치 데이터를 저장하는 상태
  const [error, setError] = useState(null); // 에러 메시지를 저장하는 상태
  const [watchId, setWatchId] = useState(null); // 위치 추적 ID를 저장하는 상태
  const [positions, setPositions] = useState([]); // 위치 기록 배열
  const [totalDistance, setTotalDistance] = useState(0); // 총 이동 거리

  // 위치 정보 요청이 성공했을 때 호출되는 함수
  const onSuccess = async (position) => {
    const { latitude, longitude } = position.coords;
    doSomething(latitude, longitude); // 위치 정보를 이용한 추가 작업 수행

    // 새로운 위치 데이터를 기록
    setPositions((prevPositions) => {
      const newPositions = [...prevPositions, { latitude, longitude }];
      if (newPositions.length > 1) {
        // 두 번째 위치부터 거리 계산
        const lastPosition = newPositions[newPositions.length - 2];
        const distance = calculateDistance(
          lastPosition.latitude,
          lastPosition.longitude,
          latitude,
          longitude
        );
        setTotalDistance((prevDistance) => prevDistance + distance);
      }
      return newPositions;
    });

    const data = await fetchReverseGeocoded(latitude, longitude); // 역지오코딩 데이터 가져오기
    setLocationData(data); // 위치 데이터 상태 업데이트
  };

  // 위치 정보 요청이 실패했을 때 호출되는 함수
  const onError = (e) => {
    if (e.code === 1) {
      alert('서비스 이용을 위해 위치 정보 제공에 동의해주세요!');
      return;
    }
    if (e.code === 2) {
      // 위치 정보를 사용할 수 없습니다. 다시 시도합니다...
      console.warn('위치 정보를 사용할 수 없습니다. 다시 시도합니다...');
      startWatchingPosition(); // 위치 추적을 다시 시작
      return;
    }
    console.error(e);
    setError(e.message); // 에러 메시지 상태 업데이트
  };

  // 위치 정보 요청 옵션
  const options = {
    enableHighAccuracy: true, // 정확한 위치 정보 제공 - 기본값은 false
    maximumAge: 30000,        // 캐시된 위치 정보의 유효 시간 - 밀리초
    timeout: 27000            // 위치 정보를 얻기까지 대기 시간 - 밀리초
  };

  // 위치 추적을 시작하는 함수
  const startWatchingPosition = useCallback(() => {
    if (!navigator.geolocation) {
      alert('지원하지 않는 브라우저 입니다!');
      return;
    }

    const id = navigator.geolocation.watchPosition(onSuccess, onError, options);
    setWatchId(id);
  }, []);

  // 위치 추적을 정지하는 함수
  const stopWatchingPosition = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null); // watchId 상태를 초기화
    }
  };

  return (
    <div>
      <h1>Reverse Geolocation</h1>
      <button onClick={startWatchingPosition} disabled={watchId !== null}>
        시작
      </button>
      <button onClick={stopWatchingPosition} disabled={watchId === null}>
        정지
      </button>
      {error && <p>Error: {error}</p>} {/* 에러 메시지 표시 */}
      {locationData && (
        <div>
          <h2>Location Data</h2>
          <p>현재 도시 : {locationData.city}</p>
          <p>현재 국가 : {locationData.countryName}</p>
          <p>위도 : {locationData.latitude}</p>
          <p>경도 : {locationData.longitude}</p>
          {/* 필요한 다른 데이터들도 추가할 수 있습니다 */}
        </div>
      )}
      <div>
        <h2>Total Distance Covered</h2>
        <p>{totalDistance.toFixed(2)} km</p> {/* 총 이동 거리 표시 */}
      </div>
    </div>
  );
};

// 위치 정보를 이용한 추가 작업을 수행하는 함수
const doSomething = (latitude, longitude) => {
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
};

export default ReverseGeolocation;
