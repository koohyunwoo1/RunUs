import React, { useEffect, useRef } from 'react';

const MapComponent = ({ positions, roomOwnerId }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({}); // 사용자별로 최신 위치 마커를 저장
  const overlays = useRef({}); // 사용자별로 오버레이를 저장

  useEffect(() => {
    if (window.kakao && mapContainer.current) {
      if (!map.current) {
        // 지도를 생성합니다.
        map.current = new window.kakao.maps.Map(mapContainer.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치 (서울)
          level: 5, // 줌 레벨
        });
      }
    }
  }, []);

  useEffect(() => {
    if (map.current && positions) {
      // 기존 마커와 오버레이를 모두 삭제합니다.
      Object.values(markers.current).forEach(marker => marker.setMap(null));
      Object.values(overlays.current).forEach(overlay => overlay.setMap(null));
      markers.current = {};
      overlays.current = {};

      // 새로운 마커와 오버레이를 추가합니다.
      Object.keys(positions).forEach(userId => {
        const { latitude, longitude, nickname } = positions[userId];
        const position = new window.kakao.maps.LatLng(latitude, longitude);

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map.current,
        });

        // 방장이면 오버레이 배경색 빨간색, 아니면 흰색
        const isOwner = userId === String(roomOwnerId); // Convert roomOwnerId to string for comparison
        const backgroundColor = isOwner ? 'red' : 'white';

        const overlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: `<div style="background: ${backgroundColor}; padding: 5px; border: 1px solid black; border-radius: 5px;">${nickname}</div>`,
          xAnchor: 0.5,
          yAnchor: 1.5,
        });

        // 오버레이를 지도에 추가
        overlay.setMap(map.current);

        // 사용자별로 최신 위치 마커와 오버레이를 저장
        markers.current[userId] = marker;
        overlays.current[userId] = overlay;
      });

      // 지도의 중앙 위치를 사용자의 첫 번째 위치로 이동합니다 (옵션).
      const firstPosition = Object.values(positions)[0];
      if (firstPosition) {
        map.current.setCenter(new window.kakao.maps.LatLng(firstPosition.latitude, firstPosition.longitude));
      }
    }
  }, [positions, roomOwnerId]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default MapComponent;
