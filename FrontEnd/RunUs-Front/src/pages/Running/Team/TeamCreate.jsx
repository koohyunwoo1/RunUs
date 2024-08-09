import React, { useState, useEffect, useContext } from "react";
import TabBar from "../../../components/common/TabBar";
import QRCode from "qrcode.react";
import "../../../styles/Running/Team/TeamCreate.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TeamUserList from "../../../components/Running/Team/TeamUserList";
import TeamSaying from "../../../components/Running/Team/TeamSaying";
import Modal from "react-modal";
import { UserContext } from "../../../hooks/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import WebSocketManager from "./WebSocketManager";
import MapComponent from '../../../components/Running/Team/MapComponent'; // 카카오맵 컴포넌트

Modal.setAppElement("#root");

const TeamPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useContext(UserContext);
  const [waitingRoomId, setWaitingRoomId] = useState(id || null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [userPositions, setUserPositions] = useState({});
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const location = useLocation();
  const [roomOwnerId, setRoomOwnerId] = useState(
    location.state?.roomOwnerId || null
  );    

  useEffect(() => {
    
    if (!userData) {
      console.log("User data is null");
      return;
    }

    console.log(userData);
    if (waitingRoomId) {
      WebSocketManager.connect(waitingRoomId); // Use singleton WebSocketManager

      WebSocketManager.on("open", () => {
        console.log("WebSocket connection opened");
        setIsWebSocketConnected(true);

        const message = {
          type: "ENTER",
          roomId: waitingRoomId,
          sender: userData.nickname,
          message: "",
          userId : userData.userId,
        };
        WebSocketManager.send(message);
      });

      WebSocketManager.on("message", (receivedData) => {
        console.log("Received message:", receivedData);

        if (receivedData.type === "USERLIST_UPDATE") {
          const messageContent = receivedData.message;
          const userList = messageContent.split("현재 방에 있는 사용자: ")[1];
          const userNames = userList ? userList.split(", ") : [];
          localStorage.setItem("userNames", JSON.stringify(userNames));
          setUserNames(userNames);
        } else if (receivedData.type === "ROOM_CLOSED") {
          alert("방장이 방을 종료했습니다. 방을 나가겠습니다.");
          navigate("/home");
        } else if (receivedData.type === "LOCATION") {
          const { sender, longitude, latitude, message } = receivedData;
          setUserPositions(prevPositions => ({
            ...prevPositions,
            [sender]: { latitude, longitude },
          }));
        } else if (receivedData.type === "START") {
          // Start sending location updates when "START" message is received
          setIsRunning(true);
        }
      });

      WebSocketManager.on("close", () => {
        console.log("WebSocket connection closed");
        setIsWebSocketConnected(false);
        setIsRunning(false);
      });

      WebSocketManager.on("error", (error) => {
        console.error("WebSocket error:", error);
      });

      return () => {
        WebSocketManager.close();
      };
    }
  }, [waitingRoomId, userData, navigate]);

  const startSendingLocation = () => {
    const updateLocation = () => {
      if (isWebSocketConnected) {
        const baseLatitude = 37.5665; // Example coordinates
        const baseLongitude = 126.978;
        const latitude = baseLatitude + (Math.random() - 0.5) * 0.01;
        const longitude = baseLongitude + (Math.random() - 0.5) * 0.01;

        const locationMessage = {
          type: 'LOCATION',
          roomId: waitingRoomId,
          sender: userData.nickname,
          message: "",
          userId : userData.userId,
          longitude,
          latitude,
        };
        WebSocketManager.send(locationMessage);
      }
    };

    const intervalId = setInterval(updateLocation, 5000);
    return () => clearInterval(intervalId);
  };

  const handleStartButtonClick = () => {
    console.log(userData);
    const startMessage = {
      type: "START",
      roomId: waitingRoomId,
      sender: userData.nickname,
      message: "",
      userId : userData.userId,
    };

    if (WebSocketManager.ws && WebSocketManager.ws.readyState === WebSocket.OPEN) {
      WebSocketManager.send(startMessage);
      setIsRunning(true);
      setIsWebSocketConnected(true); // Ensure WebSocket is connected before starting location updates
    } else {
      console.warn("WebSocket 연결이 열려있지 않거나 초기화되지 않았습니다.");
    }
  };

  const handleStop = () => {
    if (WebSocketManager.ws && WebSocketManager.ws.readyState === WebSocket.OPEN) {
      const stopMessage = {
        type: 'STOP',
        roomId: waitingRoomId,
        sender: userData.nickname,
        userId : userData.userId,
      };
      WebSocketManager.send(stopMessage);
      setIsRunning(false);
    } else {
      console.warn("WebSocket 연결이 열려있지 않거나 초기화되지 않았습니다.");
    }
  };

  const handleLeaveRoom = () => {
    const leaveMessage = {
      type: "WAIT_EXIT",
      roomId: waitingRoomId,
      sender: userData.nickname,
      message: "",
      userId : userData.userId,
    };

    if (WebSocketManager.ws && WebSocketManager.ws.readyState === WebSocket.OPEN) {
      WebSocketManager.send(leaveMessage);
      localStorage.removeItem("userNames");
    }
    WebSocketManager.close();
    navigate("/home");
  };

  const handleModalToggle = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  const teamCreatePageUrl = `https://i11e103.p.ssafy.io/team-create/${waitingRoomId}`;

  const isRoomOwner = roomOwnerId === Number(localStorage.getItem("userId"));

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
      <TabBar />
      <div className="TeamCreate">
        <div>
          <button
            onClick={handleLeaveRoom}
            style={{
              backgroundColor: "white",
              border: "none",
              marginLeft: "10px",
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
        </div>
        <div>
          <TeamSaying />
        </div>
        <div>
          <TeamUserList userNames={userNames} />
        </div>
        <div className="TeamCreateQR">
          <div>
            {isRoomOwner && (
              <button
                onClick={handleStartButtonClick}
                className="TeamCreateButton"
              >
                시작
              </button>
            )}
          </div>
          <div>
            <button onClick={handleModalToggle} className="TeamCreateButton">
              QR코드 보기
            </button>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleModalToggle}
          contentLabel="QR Code Modal"
          className="TeamCreateModal"
          overlayClassName="TeamCreateOverlay"
        >
          <QRCode
            value={teamCreatePageUrl}
            onClick={() => window.location.href = teamCreatePageUrl}
            style={{ cursor: "pointer", width: "300px", height: "300px" }}
          />
        </Modal>
        <div>
          <MapComponent positions={userPositions} />
          <div>Total Distance: {totalDistance} km</div>
          <div>Total Calories: {totalCalories} kcal</div>
          <div>Elapsed Time: {elapsedTime} seconds</div>
        </div>
        {isRunning && (
          <button onClick={handleStop} className="TeamCreateButton">
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
