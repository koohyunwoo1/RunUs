import React, { useEffect } from 'react';

const GeolocationComponent = ({ onLocationUpdate }) => {
  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      onLocationUpdate(latitude, longitude);
    };

    const handleError = (error) => {
      console.error('Error getting location:', error);
    };

    // 15초마다 위치 업데이트
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [onLocationUpdate]);

  return null; // UI를 렌더링하지 않음
};

export default GeolocationComponent;
