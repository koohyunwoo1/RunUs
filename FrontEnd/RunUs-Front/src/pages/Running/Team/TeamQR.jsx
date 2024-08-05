import React, { useContext, useState } from "react";
import "../../../styles/Running/Team/TeamQR.css";
import Header from "../../../components/common/Header";
import { UserContext } from "../../../hooks/UserContext";
import { QrReader } from 'react-qr-reader'; // 명명된 내보내기 사용

const TeamQR = () => {
  const [data, setData] = useState("No result");
  const { addUserToRoom, userData } = useContext(UserContext);

  const handleScan = (result) => {
    if (result) {
      const resultData = result;
      setData(resultData);

      if (isValidURL(resultData)) {
        const roomId = extractRoomIdFromUrl(resultData);
        if (roomId) {
          addUserToRoom({
            userId: userData.userId,
            nickname: userData.nickname,
          });
          joinRoom(roomId);
          window.location.href = resultData; // URL로 이동
        } else {
          console.log("Room ID를 추출할 수 없습니다:", resultData);
        }
      } else {
        console.log("Scanned result is not a valid URL:", resultData);
      }
    }
  };

  const handleError = (error) => {
    console.error("QR Reader Error:", error);
  };

  const joinRoom = (roomId) => {
    const ws = new WebSocket(`wss://i11e103.p.ssafy.io:8001/ws/chat?roomId=${roomId}`);

    ws.onopen = () => {
      console.log("WebSocket connection opened");

      const message = {
        type: 'ENTER',
        roomId: roomId,
        sender: userData.nickname,
        message: '',
        userId: userData.userId
      };
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      const receivedData = event.data;
      console.log("Received message:", receivedData);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const extractRoomIdFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");
      return pathSegments[pathSegments.length - 1]; // 마지막 segment가 roomId라고 가정
    } catch (e) {
      console.error("Failed to extract room ID from URL:", e);
      return null;
    }
  };

  return (
    <div>
      <Header />
      <h1 className="TeamQR">QR 코드를 찍어주세요!</h1>
      <div className="qr-reader-container">
        <QrReader
          onScan={handleScan}
          onError={handleError}
          style={{ width: "100%", height: "100%" }}
          facingMode="environment" // 후면 카메라 사용
        />
      </div>
    </div>
  );
};

export default TeamQR;
