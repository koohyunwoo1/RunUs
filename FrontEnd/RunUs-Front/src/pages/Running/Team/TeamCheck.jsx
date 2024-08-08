import React, { useState, useEffect, useContext } from "react";
import MapComponent from '../../../components/Running/Team/MapComponent'; // 카카오맵 컴포넌트
import { UserContext } from '../../../hooks/UserContext'; // 사용자 정보 가져오기
import { useLocation, useNavigate } from 'react-router-dom';
import WebSocketManager from './WebSocketManager';

const TeamCheck = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const roomId = loc.pathname.slice(12); // URL 매개변수에서 roomId 추출
  const { userData } = useContext(UserContext);
  const [userPositions, setUserPositions] = useState({});
  const [userNames, setUserNames] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

  useEffect(() => {
    if (!roomId) {
      console.error('roomId is not available');
      return;
    }
  
    WebSocketManager.connect(roomId); // WebSocket 연결
  
    const handleMessage = (receivedData) => {
      console.log("Received message:", receivedData);
  
      if (receivedData && receivedData.type === 'LOCATION') {
        const { sender, longitude, latitude, message } = receivedData;
  
        // Update state or UI with the received location data
        setUserPositions(prevPositions => ({
          ...prevPositions,
          [sender]: { latitude, longitude },
        }));
  
        console.log(`Received location from ${sender}:`);
        console.log(`Longitude: ${longitude}, Latitude: ${latitude}`);
        console.log(`Message: ${message}`);
      } else {
        console.warn('Unexpected message type or data:', receivedData);
      }
    };
  
    const handleOpen = () => {
      console.log('WebSocket connection opened');
      setIsWebSocketConnected(true);
  
      // Automatically start sending location updates
      setIsRunning(true);
    };
  
    const handleClose = () => {
      console.log('WebSocket connection closed');
      setIsWebSocketConnected(false);
      setIsRunning(false);
    };
  
    WebSocketManager.on('message', handleMessage); // 메시지 이벤트 리스너 추가
    WebSocketManager.on('open', handleOpen);
    WebSocketManager.on('close', handleClose);
    WebSocketManager.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  
    return () => {
      WebSocketManager.off('message', handleMessage);
      WebSocketManager.off('open', handleOpen);
      WebSocketManager.off('close', handleClose);
      WebSocketManager.close();
    };
  }, [roomId]);
  

  const handleStop = () => {
    if (WebSocketManager.ws && WebSocketManager.ws.readyState === WebSocket.OPEN) {
      const stopMessage = {
        type: 'STOP',
        roomId,
        sender: userData.nickname,
        userId: userData.userId,
      };
      WebSocketManager.send(stopMessage);
      setIsRunning(false);
      console.log('STOP 메시지 전송');
    } else {
      console.warn('WebSocket 연결이 열려있지 않거나 초기화되지 않았습니다.');
    }
  };

  const getDummyLocation = () => {
    const baseLatitude = 37.5665; // 서울시청 좌표 (예시)
    const baseLongitude = 126.978; // 서울시청 좌표 (예시)
    return {
      latitude: baseLatitude + (Math.random() - 0.5) * 0.01,
      longitude: baseLongitude + (Math.random() - 0.5) * 0.01,
    };
  };

  const startSendingLocation = () => {
    const updateLocation = () => {
      console.log('Attempting to send location...');
      if (isWebSocketConnected) {
        const { latitude, longitude } = getDummyLocation();
        if (WebSocketManager.ws && WebSocketManager.ws.readyState === WebSocket.OPEN) {
          const locationMessage = {
            type: 'LOCATION',
            roomId,
            sender: userData.nickname,
            message: `${userData.nickname}의 총 이동 거리: ${Math.round(Math.random() * 100) / 10} km`,
            userId: userData.userId,
            longitude,
            latitude,
          };
          WebSocketManager.send(locationMessage);
          console.log(`위치 정보 전송: ${JSON.stringify(locationMessage)}`);
        } else {
          console.warn('WebSocket is not open. ReadyState:', WebSocketManager.ws.readyState);
        }
      }
    };

    const intervalId = setInterval(updateLocation, 5000);
    return () => clearInterval(intervalId);
  };

  useEffect(() => {
    let stopSendingLocation;

    if (isRunning && isWebSocketConnected) {
      stopSendingLocation = startSendingLocation();
    }

    return () => {
      if (stopSendingLocation) stopSendingLocation();
    };
  }, [isRunning, isWebSocketConnected]);

  return (
    <div>
      <h1>Team Check</h1>
      <button onClick={handleStop}>Stop</button>
      <MapComponent positions={userPositions} />
      <div>Total Distance: {totalDistance} km</div>
      <div>Total Calories: {totalCalories} kcal</div>
      <div>Elapsed Time: {elapsedTime} seconds</div>
      {!isWebSocketConnected && <div>WebSocket 연결이 끊어졌습니다. 재연결을 시도 중입니다...</div>}
    </div>
  );
};

export default TeamCheck;
