import React, { useState, useEffect, useContext, useRef } from "react";
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
import MapComponent from "../../../components/Running/Team/MapComponent";
import axios from "axios";
import Running from "../Running";

Modal.setAppElement("#root");

const TeamPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { party } = useParams();
  const { roomOwnerId } = useParams();
  const { userData } = useContext(UserContext);
  const [waitingRoomId, setWaitingRoomId] = useState(id || null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [userPositions, setUserPositions] = useState({});
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isRunningStarted, setIsRunningStarted] = useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const location = useLocation();
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [time, setTime] = useState(0);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const latestLocation = useRef({ latitude: null, longitude: null, distance: null });

  useEffect(() => {
    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const userId = userData.userId;

      setUserPositions((prevPositions) => ({
        ...prevPositions,
        [userId]: {
          nickname: userData.nickname,
          latitude,
          longitude,
          userId,
        },
      }));
    };

    const handleError = (error) => {
      console.error("Geolocation error:", error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) {
      console.log("User data is null");
      return;
    }

    console.log(userData);
    if (waitingRoomId) {
      const timer = setTimeout(() => {
        WebSocketManager.connect(waitingRoomId);

        WebSocketManager.on("open", () => {
          console.log("WebSocket connection opened");
          setIsWebSocketConnected(true);

          const message = {
            type: "ENTER",
            roomId: waitingRoomId,
            sender: userData.nickname,
            message: "",
            userId: userData.userId,
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
            setUserNames(
              userNames.map((user) => ({ name: user, distance: "0.00 km" }))
            );
          } else if (receivedData.type === "ROOM_CLOSED") {
            alert("방장이 방을 종료했습니다. 방을 나가겠습니다.");
            navigate("/home");
          } else if (receivedData.type === "LOCATION") {
            const { sender, distance, longitude, latitude, userId, message } = receivedData;
            const displayName = userId === roomOwnerId ? `${sender}` : sender;
        
            setUserPositions((prevPositions) => ({
              ...prevPositions,
              [userId]: { nickname: displayName, latitude, longitude, userId },
            }));
        
            setUserNames((prevUserNames) =>
              prevUserNames.map((user) =>
                user.name === sender ? { ...user, distance: `${distance.toFixed(2)} km` } : user
              )
            );
          } else if (receivedData.type === "START") {
            setIsRunning(true);
            setIsRunningStarted(true);
          } else if (receivedData.type === "QUIT") {
            try {
              const response = axios.post("api/v1/record/result_save", null, {
                params: {
                  user_id: userData.userId,
                  party_id: party,
                  distance: distance,
                  time: elapsedTime,
                  kcal: totalCalories,
                },
              });
              console.log(response);
        
              navigate(`/home`);
            } catch (err) {
              console.error(err);
            }
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
      }, 2000);

      return () => {
        clearTimeout(timer);
        WebSocketManager.close();
      };
    }
  }, [waitingRoomId, userData, navigate, roomOwnerId]);

  const startSendingLocation = () => {
    const updateLocation = () => {
      if (isWebSocketConnected) {
        const { latitude, longitude, distance } = latestLocation.current;
        if (latitude !== null && longitude !== null && distance !== null && userData.nickname !== null && userData.nickname !== "null") {
          const locationMessage = {
            type: "LOCATION",
            roomId: waitingRoomId,
            sender: userData.nickname,
            message: "",
            userId: userData.userId,
            longitude,
            latitude,
            distance,
          };
          WebSocketManager.send(locationMessage);
          console.log("Sent location message:", locationMessage);
        }
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
      userId: userData.userId,
    };

    if (
      WebSocketManager.ws &&
      WebSocketManager.ws.readyState === WebSocket.OPEN
    ) {
      WebSocketManager.send(startMessage);
      setIsWebSocketConnected(true);
      setIsRunningStarted(true);
      setIsRunning(true);
    } else {
      console.warn("WebSocket 연결이 열려있지 않거나 초기화되지 않았습니다.");
    }
  };

  const handleQuit = () => {
    if (
      WebSocketManager.ws &&
      WebSocketManager.ws.readyState === WebSocket.OPEN
    ) {
      const stopMessage = {
        type: "QUIT",
        roomId: waitingRoomId,
        sender: userData.nickname,
        message: "방장이 종료 버튼을 눌렀습니다.",
        userId: userData.userId,
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
      userId: userData.userId,
    };

    if (
      WebSocketManager.ws &&
      WebSocketManager.ws.readyState === WebSocket.OPEN
    ) {
      WebSocketManager.send(leaveMessage);
      localStorage.removeItem("userNames");
    }
    WebSocketManager.close();
    navigate("/home");
  };

  const handleModalToggle = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  const teamCreatePageUrl = `https://i11e103.p.ssafy.io/team-create/${waitingRoomId}/${party}/${roomOwnerId}`;

  const isRoomOwner =
    roomOwnerId == Number(localStorage.getItem("userId").trim());

  useEffect(() => {
    let stopSendingLocation;

    if (isRunning && isWebSocketConnected) {
      stopSendingLocation = startSendingLocation();
    }

    return () => {
      if (stopSendingLocation) stopSendingLocation();
    };
  }, [isRunning, isWebSocketConnected]);

  const handleLocationUpdate = (latitude, longitude, newDistance) => {
    setDistance(newDistance);
    latestLocation.current = { latitude, longitude, distance: newDistance };
  };

  const updateDistance = (newDistance) => {
    setDistance(newDistance);
    
    if (isWebSocketConnected) {
      const locationMessage = {
        type: "LOCATION",
        roomId: waitingRoomId,
        sender: userData.nickname,
        message: "",
        userId: userData.userId,
        longitude: latestLocation.current.longitude,
        latitude: latestLocation.current.latitude,
        distance: newDistance,
      };
      WebSocketManager.send(locationMessage);
    }
  };

  return (
    <div>
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
            {isRoomOwner && !isRunning && (
              <button
                onClick={handleStartButtonClick}
                className="TeamCreateButton"
              >
                시작
              </button>
            )}
            {isRoomOwner && isRunning && (
              <button
                onClick={handleQuit}
                className="TeamCreateButton"
              >
                Quit
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
            onClick={() => (window.location.href = teamCreatePageUrl)}
            style={{ cursor: "pointer", width: "300px", height: "300px" }}
          />
        </Modal>
        <div>
          <MapComponent positions={userPositions} roomOwnerId={roomOwnerId} />
        </div>

        <div>
          <Running
            distance={distance}
            setDistance={updateDistance}
            calories={calories}
            setCalories={setCalories}
            time={time}
            setTime={setTime}
            onLocationUpdate={handleLocationUpdate}
            isRunningStarted={isRunningStarted}
          />
          <p>{distance}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;