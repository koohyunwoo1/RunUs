import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GeolocationComponent from '../../../components/Running/Team/GeolocationComponent';
import MapComponent from '../../../components/Running/Team/MapComponent';
import { UserContext } from '../../../hooks/UserContext';

const TeamCheck = () => {
  const { roomId } = useParams(); // Get room ID from URL parameters
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [webSocket, setWebSocket] = useState(null);
  const [userPositions, setUserPositions] = useState({});
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!roomId) {
      console.error('roomId is not available');
      return;
    }

    // Only create a new WebSocket connection if one doesn't already exist
    if (webSocket) {
      return; // Skip creating a new connection if one is already established
    }

    const ws = new WebSocket(`wss://i11e103.p.ssafy.io:8001/ws/chat?roomId=${roomId}`);
    setWebSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setWebSocket(null); // Clear the WebSocket state when the connection closes
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'UPDATE_POSITION':
          setUserPositions((prevPositions) => ({
            ...prevPositions,
            [message.userId]: { latitude: message.latitude, longitude: message.longitude },
          }));
          break;
        case 'UPDATE_DISTANCE':
          setTotalDistance(message.distance);
          break;
        case 'UPDATE_CALORIES':
          setTotalCalories(message.calories);
          break;
        case 'UPDATE_TIME':
          setElapsedTime(message.elapsedTime);
          break;
        case 'USERLIST_UPDATE':
          // 사용자 목록 업데이트 처리
          break;
        default:
          break;
      }
    };

    return () => {
      ws.close(); // Close the WebSocket connection when the component unmounts
    };
  }, [roomId, webSocket]);

  const handleStart = () => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const startMessage = {
        type: 'START',
        roomId,
        sender: user.nickname,
        userId: user.userId,
      };
      webSocket.send(JSON.stringify(startMessage));
      setIsRunning(true);
      console.log('START 메시지 전송');
    } else {
      console.warn('WebSocket 연결이 열려있지 않거나 초기화되지 않았습니다.');
    }
  };

  const handleStop = () => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const stopMessage = {
        type: 'STOP',
        roomId,
        sender: user.nickname,
        userId: user.userId,
      };
      webSocket.send(JSON.stringify(stopMessage));
      setIsRunning(false);
      console.log('STOP 메시지 전송');
    } else {
      console.warn('WebSocket 연결이 열려있지 않거나 초기화되지 않았습니다.');
    }
  };

  return (
    <div>
      <h1>Team Check</h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <GeolocationComponent
        onLocationUpdate={(lat, lon) => {
          if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            const locationMessage = {
              type: 'UPDATE_LOCATION',
              roomId,
              userId: user.userId,
              latitude: lat,
              longitude: lon,
            };
            webSocket.send(JSON.stringify(locationMessage));
          }
        }}
      />
      <MapComponent positions={userPositions} />
      {/* Distance, calories, and time display */}
      <div>Total Distance: {totalDistance} km</div>
      <div>Total Calories: {totalCalories} kcal</div>
      <div>Elapsed Time: {elapsedTime} seconds</div>
    </div>
  );
};

export default TeamCheck;
