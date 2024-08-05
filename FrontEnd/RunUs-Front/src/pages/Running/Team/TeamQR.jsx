import React, { useContext, useEffect, useRef, useState } from "react";
import QrScanner from "react-qr-scanner";
import "../../../styles/Running/Team/TeamQR.css";
import Header from "../../../components/common/Header";
import { UserContext } from "../../../hooks/UserContext";

const TeamQR = () => {
  const [data, setData] = useState("No result");
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const { addUserToRoom, userData } = useContext(UserContext);
  const videoRef = useRef(null);

  useEffect(() => {
    // Get available video input devices
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoInputDevices = devices.filter(device => device.kind === "videoinput");
      setVideoDevices(videoInputDevices);
      
      // Try to find a rear camera
      const rearCamera = videoInputDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear'));
      setSelectedDeviceId(rearCamera ? rearCamera.deviceId : videoInputDevices[0].deviceId);
    });
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      const constraints = {
        video: { deviceId: { exact: selectedDeviceId } }
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing the camera:", err);
        });
    }
  }, [selectedDeviceId]);

  const handleScan = (result) => {
    if (result && result.text) {
      const resultData = result.text;
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

  const handleError = (err) => {
    console.error(err);
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
        <video ref={videoRef} style={{ width: "100%", height: "100%" }} autoPlay />
        <QrScanner
          delay={100}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default TeamQR;
