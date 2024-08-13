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
  const { id, party, roomOwnerId } = useParams();
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
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [time, setTime] = useState(0);
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
          //console.log("Received message:", receivedData);

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
            const { sender, distance, longitude, latitude, userId } = receivedData;
            const displayName = userId === roomOwnerId ? `${sender}` : sender;

            setUserPositions((prevPositions) => ({
              ...prevPositions,
              [userId]: { nickname: displayName, latitude, longitude, userId },
            }));

            // setUserNames((prevUserNames) =>
            //   prevUserNames.map((user) =>
            //     user.name === sender ? { ...user, distance: distance !== undefined ? `${distance.toFixed(2)} km` : '0.00 km' } : user
            //   )
            // );
          } else if (receivedData.type === "START") {
            setIsRunning(true);
            setIsRunningStarted(true);
          } else if (receivedData.type === "QUIT") {
            try {
              const response = axios.post("api/v1/record/result_save", null, {
                params: {
                  user_id: userData.userId,
                  party_id: party,
                  distance: Math.round(distance),
                  time: Math.round(time),
                  kcal: Math.round(calories),
                },
              });
              
              console.log(userData.userId);
              console.log(party)
              console.log(Math.round(distance))
              console.log(Math.round(time))
              console.log(Math.round(calories))
              navigate(`/home`);
            } catch (err) {
              console.error(err);
            }
          } else if (receivedData.type === "DISTANCE") {
            const messageContent = receivedData.message;
            const [nickname, distanceStr] = messageContent.split("의 총 이동 거리: ");
            const distance = parseFloat(distanceStr.split(" km")[0]);
        
            setUserNames((prevUserNames) =>
              prevUserNames.map((user) =>
                user.name === nickname
                  ? { ...user, distance: `${distance.toFixed(2)} km` }
                  : user
              )
            );
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

  useEffect(() => {
    let intervalId;

    if (isRunning && isWebSocketConnected) {
      intervalId = setInterval(() => {
        const { latitude, longitude, distance } = latestLocation.current;
        if (latitude !== null && longitude !== null) {
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

          // 자신의 위치 업데이트
          setUserPositions((prevPositions) => ({
            ...prevPositions,
            [userData.userId]: { 
              nickname: userData.nickname, 
              latitude, 
              longitude, 
              userId: userData.userId 
            },
          }));

          // 사용자 목록 업데이트
          setUserNames((prevUserNames) =>
            prevUserNames.map((user) =>
              user.name === userData.nickname 
                ? { ...user, distance: `${distance.toFixed(2)} km` } 
                : user
            )
          );
        }
      }, 5000); // 5초 간격으로 실행
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, isWebSocketConnected, waitingRoomId, userData]);

  const handleLocationUpdate = (latitude, longitude, newDistance) => {
    if (newDistance !== undefined && newDistance !== null) {
      setDistance(newDistance);
      latestLocation.current = { latitude, longitude, distance: newDistance };
    }
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
            setDistance={setDistance}
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