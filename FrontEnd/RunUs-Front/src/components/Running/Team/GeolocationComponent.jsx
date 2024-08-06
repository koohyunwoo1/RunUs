import React, { useEffect } from 'react';

const GeolocationComponent = ({ onLocationUpdate }) => {
  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      onLocationUpdate(latitude, longitude);
    };

    const handleError = (error) => {
      console.error('Error getting location:', error);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10초 내에 위치 정보를 가져오지 못하면 에러 발생
      maximumAge: 0 // 항상 최신 위치 정보를 가져옴
    };

    // 10초마다 위치 업데이트
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
    }, 10000); // 10초로 설정

    return () => clearInterval(intervalId);
  }, [onLocationUpdate]);

  return null; // UI를 렌더링하지 않음
};

export default GeolocationComponent;
