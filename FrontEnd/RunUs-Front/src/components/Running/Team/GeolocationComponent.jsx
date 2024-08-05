import React, { useEffect, useState, useRef } from 'react';

const GeolocationComponent = ({ userId, roomId }) => {
  const [position, setPosition] = useState({ latitude: 37.5665, longitude: 126.9780 });
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    if (!roomId || !userId) return;

    const newWs = new WebSocket(`https://i11e103.p.ssafy.io:8001/ws/chat?roomId=${roomId}`);
    
    newWs.onopen = () => {
      console.log("WebSocket connection opened");
    };

    newWs.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    newWs.onclose = () => {
      console.log("WebSocket connection closed");
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, [roomId, userId]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition({ latitude, longitude });

        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "position",
            userId,
            position: { latitude, longitude },
          }));
        }
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [ws, userId]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      if (mapRef.current && position) {
        const { latitude, longitude } = position;

        // 카카오맵 초기화
        const mapContainer = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };
        const map = new window.kakao.maps.Map(mapContainer, options);

        // 마커 추가
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
        markerRef.current = marker;
      }
    } else {
      console.error('Kakao Maps API is not loaded.');
    }
  }, [position]);

  return (
    <div>
      <h1>Geolocation Component</h1>
      <div
        id="map"
        ref={mapRef}
        style={{ width: "100%", height: "500px" }}
      ></div>
    </div>
  );
};

export default GeolocationComponent;