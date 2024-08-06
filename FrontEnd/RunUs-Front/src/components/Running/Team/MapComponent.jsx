import React, { useState, useEffect, useRef } from 'react';
import GeolocationComponent from './GeolocationComponent';

const MapComponent = () => {
  const [location, setLocation] = useState({ latitude: 37.5665, longitude: 126.978 }); // 기본 좌표 (서울)
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (window.kakao && !map.current) {
      // 지도를 생성합니다.
      map.current = new window.kakao.maps.Map(mapContainer.current, {
        center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
        level: 5, // 줌 레벨
      });
    }

    if (location && map.current) {
      // 마커를 생성합니다.
      if (!marker.current) {
        marker.current = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(location.latitude, location.longitude),
        });
        marker.current.setMap(map.current);
      } else {
        marker.current.setPosition(new window.kakao.maps.LatLng(location.latitude, location.longitude));
      }

      // 지도를 새 위치로 이동
      map.current.setCenter(new window.kakao.maps.LatLng(location.latitude, location.longitude));
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
