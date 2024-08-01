import React, { useState, useEffect, useCallback } from "react";

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lat2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const ReverseGeolocation = ({ teamMembers, owner_user_id, roomId }) => {
  const [positions, setPositions] = useState({});
  const [totalDistance, setTotalDistance] = useState({});
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!roomId) {
      console.error("Room ID is not provided");
      return;
    }

    const ws = new WebSocket(`ws://localhost:8080/ws/chat?roomId=${roomId}`);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        const { userId, latitude, longitude } = data;

        setPositions((prevPositions) => ({
          ...prevPositions,
          [userId]: { latitude, longitude }
        }));

        if (owner_user_id && positions[owner_user_id]) {
          const distanceToLeader = calculateDistance(
            latitude,
            longitude,
            positions[owner_user_id].latitude,
            positions[owner_user_id].longitude
          );

          setTotalDistance((prevTotalDistance) => ({
            ...prevTotalDistance,
            [userId]: (prevTotalDistance[userId] || 0) + distanceToLeader
          }));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setError("Invalid data received from WebSocket.");
      }
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
      setError("WebSocket error occurred");
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomId, owner_user_id, positions]);

  const sendPosition = useCallback((userId, position) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const { latitude, longitude } = position.coords;
      const data = { userId, latitude, longitude };
      socket.send(JSON.stringify(data));
    }
  }, [socket]);

  const onSuccess = (userId, position) => {
    sendPosition(userId, position);
  };

  const onError = (e) => {
    if (e.code === 1) {
      alert("서비스 이용을 위해 위치 정보 제공에 동의해주세요!");
    } else if (e.code === 2) {
      console.warn("위치 정보를 사용할 수 없습니다. 다시 시도합니다...");
      startWatchingPosition();
    } else {
      console.error(e);
      setError(e.message);
    }
  };

  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000,
  };

  const startWatchingPosition = useCallback((userId) => {
    if (!navigator.geolocation) {
      alert("지원하지 않는 브라우저 입니다!");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => onSuccess(userId, position),
      onError,
      options
    );
  }, [sendPosition]);

  const startTracking = () => {
    if (teamMembers) {
      teamMembers.forEach((member) => startWatchingPosition(member.userId));
    }
    if (owner_user_id) {
      startWatchingPosition(owner_user_id);
    }
  };

  return (
    <div>
      <h1>Reverse Geolocation with WebSocket</h1>
      <button onClick={startTracking}>시작</button>
      {error && <p>Error: {error}</p>}
      <div>
        <h2>Total Distance Covered</h2>
        <ul>
          {Object.keys(totalDistance).map((userId) => (
            <li key={userId}>
              User {userId}: {totalDistance[userId]?.toFixed(2)} km
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReverseGeolocation;
