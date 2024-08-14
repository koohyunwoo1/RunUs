import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 커스텀 아이콘 설정
const customIcon = new L.DivIcon({
  className: "custom-icon",
  html: `
    <div style="
      background-color: #4ee2ec;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 4px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapView = () => {
  const [position, setPosition] = useState(null);
  const [audio] = useState(new Audio("/sounds/HereMe.mp3")); // public 디렉토리 내의 절대 경로 사용
  const prevLocation = useRef({
    latitude: null,
    longitude: null,
    timestamp: null,
    speed: null,
  }); // 이전 위치 정보

  useEffect(() => {
    if (navigator.geolocation) {
      const handleSuccess = (position) => {
        const { latitude, longitude, speed } = position.coords;
        const currentTime = Date.now();

        if (
          prevLocation.current.latitude !== null &&
          prevLocation.current.longitude !== null
        ) {
          const timeElapsed =
            (currentTime - prevLocation.current.timestamp) / 1000; // 초 단위로 변환
          const maxPossibleDistance =
            (prevLocation.current.speed || 0) * timeElapsed;
          const dist = calculateDistance(
            prevLocation.current.latitude,
            prevLocation.current.longitude,
            latitude,
            longitude
          );

          if (dist > maxPossibleDistance) {
            const correctedLocation = correctLocation(
              prevLocation.current.latitude,
              prevLocation.current.longitude,
              latitude,
              longitude,
              maxPossibleDistance
            );
            setPosition([
              correctedLocation.latitude,
              correctedLocation.longitude,
            ]);
            prevLocation.current = {
              ...correctedLocation,
              timestamp: currentTime,
              speed,
            };
          } else {
            setPosition([latitude, longitude]);
            prevLocation.current = {
              latitude,
              longitude,
              timestamp: currentTime,
              speed,
            };
          }
        } else {
          setPosition([latitude, longitude]);
          prevLocation.current = {
            latitude,
            longitude,
            timestamp: currentTime,
            speed,
          };
        }
      };

      const handleError = (error) => {
        console.error("Geolocation error:", error);
      };

      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
      const watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const playSound = () => {
    if (audio) {
      audio.play().catch((error) => {
        console.error("Audio play error:", error);
      });
    } else {
      console.error("Audio file not loaded");
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const rad = Math.PI / 180;
    const φ1 = lat1 * rad;
    const φ2 = lat2 * rad;
    const Δφ = (lat2 - lat1) * rad;
    const Δλ = (lon2 - lon1) * rad;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const correctLocation = (lat1, lon1, lat2, lon2, maxDist) => {
    const dist = calculateDistance(lat1, lon1, lat2, lon2);
    const ratio = maxDist / dist;
    const correctedLat = lat1 + (lat2 - lat1) * ratio;
    const correctedLon = lon1 + (lon2 - lon1) * ratio;
    return { latitude: correctedLat, longitude: correctedLon };
  };

  if (!position) return null;

  return (
    <MapContainer
      center={position}
      zoom={17}
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={position}
        icon={customIcon}
        eventHandlers={{
          click: () => {
            playSound();
          },
        }}
      >
        <Popup>
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "black",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            Here me !
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
