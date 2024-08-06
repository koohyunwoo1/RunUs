import React, { useState, useEffect, useRef } from 'react';
import GeolocationComponent from './GeolocationComponent';

const MapComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    // 현재 위치를 가져오는 함수
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error(error);
            // 오류 발생 시 기본 좌표 설정 (서울)
            setLocation({ latitude: 37.5665, longitude: 126.978 });
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Geolocation을 지원하지 않는 경우 기본 좌표 설정 (서울)
        setLocation({ latitude: 37.5665, longitude: 126.978 });
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (window.kakao && location.latitude && location.longitude) {
      if (!map.current) {
        // 지도를 생성합니다.
        map.current = new window.kakao.maps.Map(mapContainer.current, {
          center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
          level: 5, // 줌 레벨
        });
      } else {
        // 지도를 새 위치로 이동
        map.current.setCenter(new window.kakao.maps.LatLng(location.latitude, location.longitude));
      }

      // 마커를 생성합니다.
      if (!marker.current) {
        marker.current = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(location.latitude, location.longitude),
        });
        marker.current.setMap(map.current);
      } else {
        marker.current.setPosition(new window.kakao.maps.LatLng(location.latitude, location.longitude));
      }
    }
  }, [location]);

  return (
    <div>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '400px' }}
      />
      <GeolocationComponent onLocationUpdate={(lat, lon) => setLocation({ latitude: lat, longitude: lon })} />
    </div>
  );
};

export default MapComponent;
