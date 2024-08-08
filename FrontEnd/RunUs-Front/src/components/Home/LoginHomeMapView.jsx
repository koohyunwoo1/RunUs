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
  const [position, setPosition] = useState(null);
  const [audio] = useState(new Audio("/sounds/HereMe.mp3")); // public 디렉토리 내의 절대 경로 사용

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

  const playSound = () => {
    if (audio) {
      audio.play().catch((error) => {
        console.error("Audio play error:", error);
      });
    } else {
      console.error("Audio file not loaded");
    }
  };

  if (!position) return null;

  return (
    <MapContainer
      center={position}
      zoom={15}
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
