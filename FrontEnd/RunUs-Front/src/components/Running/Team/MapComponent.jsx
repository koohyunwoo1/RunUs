import React, { useEffect, useRef } from "react";

const MapComponent = ({ positions, roomOwnerId }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({}); // 사용자별로 최신 위치 마커를 저장
  console.log(markers);
  const overlays = useRef({}); // 사용자별로 오버레이를 저장

  useEffect(() => {
    if (window.kakao && mapContainer.current) {
      if (!map.current) {
        // 지도를 생성합니다.
        map.current = new window.kakao.maps.Map(mapContainer.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치 (서울)
          level: 1, // 줌 레벨
        });
      }
    }
  }, []);

  useEffect(() => {
    if (map.current && positions) {
      // 기존 마커와 오버레이를 모두 삭제합니다.
      Object.values(markers.current).forEach((marker) => marker.setMap(null));
      Object.values(overlays.current).forEach((overlay) =>
        overlay.setMap(null)
      );
      markers.current = {};
      overlays.current = {};

      // 새로운 마커와 오버레이를 추가합니다.
      Object.keys(positions).forEach((userId) => {
        const { latitude, longitude, nickname } = positions[userId];

        // 닉네임이 null이면 마커와 오버레이를 생성하지 않습니다.
        if (nickname === null) {
          return;
        }

        const position = new window.kakao.maps.LatLng(latitude, longitude);

        // 방장이면 오버레이 배경색 빨간색, 아니면 흰색
        const isOwner = userId === String(roomOwnerId); // Convert roomOwnerId to string for comparison
        const backgroundColor = isOwner ? "#4ee2ec" : "black"; // 방장: 빨간색, 일반 사용자: 흰색

        // 커스텀 오버레이 생성
        const overlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: `
            <div style="
              background: ${backgroundColor}; 
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid black;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
             ${nickname}
            </div>`,
          xAnchor: 0.5,
          yAnchor: 1.5,
        });

        // 오버레이를 지도에 추가
        overlay.setMap(map.current);

        // 사용자별로 최신 위치 마커와 오버레이를 저장
        markers.current[userId] = overlay; // 마커는 실제로 오버레이로 대체됩니다.
        overlays.current[userId] = overlay;
      });

      // 지도의 중앙 위치를 사용자의 첫 번째 위치로 이동합니다 (옵션). <- 이거 사용자 아이디에 따라 가야함. 
      const firstPosition = Object.values(positions)[0];
      if (firstPosition) {
        map.current.setCenter(
          new window.kakao.maps.LatLng(
            firstPosition.latitude,
            firstPosition.longitude
          )
        );
      }
    }
  }, [positions, roomOwnerId]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
};

export default MapComponent;
