import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const [position, setPosition] = useState(null); // 초기값을 null로 설정

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!position) return null; // 위치가 없으면 아무 것도 렌더링하지 않음

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
      <Marker position={position} icon={customIcon}>
        <Popup>You are here.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
