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
import CountDown from "../../Running/Team/CountDown";
import Swal from "sweetalert2";
import "../../../styles/Home/LoginHomeCustomSwal.css";
import { faStop, faPlay } from "@fortawesome/free-solid-svg-icons";
Modal.setAppElement("#root");

const TeamCreate = () => {
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
  const [isCountdownVisible, setIsCountdownVisible] = useState(false);
  const [countdownFinished, setCountdownFinished] = useState(false);
  const location = useLocation();
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [time, setTime] = useState(0);
  const latestLocation = useRef({
    latitude: null,
    longitude: null,
    distance: null,
  });
  const [notification, setNotification] = useState(null); // 알림 메시지 상태
  const lastNotificationTime = useRef(null);  // 알림 제한

  const isRoomOwner =
  userData && userData.userId ? roomOwnerId == userData.userId : false;

  const playAlertSound = () => {
    const audio = new Audio('/sounds/HereMe.mp3'); // 경로를 실제 경로로 변경하세요
    audio.play();
  };


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // 지구 반지름 (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 거리 (km)
    return distance * 1000; // 미터로 변환
  };
  
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
    if (!isRunning && isRunningStarted) {
      saveResults();
    }
  }, [isRunning, distance, time, calories]);

  const saveResults = async () => {
    try {
      const requestbody = {
        userId: userData.userId,
        partyId: party,
        distance: distance,
        time: time,
        kcal: calories,
      };
      console.log("파라미터 데이터: " + JSON.stringify(requestbody, null, 2));
      const response = await axios.post(
        "api/v1/record/result_save",
        requestbody
      );
      console.log(response);

      navigate(`/report-home`);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userData) {
      console.log("User data is null");
      return;
    }

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
          if (receivedData.type === "USERLIST_UPDATE") {
            const messageContent = receivedData.message;
            const userList = messageContent.split("현재 방에 있는 사용자: ")[1];
            const userNames = userList ? userList.split(", ") : [];
            localStorage.setItem("userNames", JSON.stringify(userNames));
            setUserNames(
              userNames.map((user) => ({
                name: user,
                distance: distance,
              }))
            );
          } else if (receivedData.type === "ROOM_CLOSED") {
            alert("방장이 방을 종료했습니다. 방을 나가겠습니다.");
            navigate("/report-home");
          } else if (receivedData.type === "LOCATION") {
            const { sender, longitude, latitude, userId } =
              receivedData;
           // const displayName = userId === roomOwnerId ? `${sender}` : sender;

            setUserPositions((prevPositions) => ({
              ...prevPositions,
              [userId]: { nickname: sender, latitude, longitude, userId },
            }));
          } else if (receivedData.type === "START") {
            setIsRunning(true);
            setIsRunningStarted(true);
            setIsCountdownVisible(true);
            setCountdownFinished(false);
            setTimeout(() => {
              setIsCountdownVisible(false);
              setCountdownFinished(true);
            }, 3000); // 3초 후에 실제 실행
          } else if (receivedData.type === "QUIT") {
            setIsRunning(false);
           } 
          //else if (receivedData.type === "DISTANCE") {
          //   const messageContent = receivedData.message;
          //   let nickname;
          //   if (messageContent.includes("(방장)")) {
          //     nickname = messageContent.split("(방장)의 총 이동 거리: ")[0];
          //   } else {
          //     nickname = messageContent.split("의 총 이동 거리: ")[0];
          //   }

          //   const distanceStr = messageContent.split("의 총 이동 거리: ")[1];
          //   const distance = parseFloat(distanceStr.split(" km")[0]);
          //   setUserNames((prevUserNames) =>
          //     prevUserNames.map((user) =>
          //       user.name == nickname
          //         ? { ...user, distance: `${distance.toFixed(2)} ` }
          //         : user
          //     )
          //   );
          // }
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
    let watchId;
  
    if (isRunning && isWebSocketConnected) {
      // Geolocation 감시 시작
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          //const newDistance = calculateDistance(latitude, longitude); // 거리 계산 함수 필요
  
          latestLocation.current = { latitude, longitude,};
  
          const locationMessage = {
            type: "LOCATION",
            roomId: waitingRoomId,
            sender: userData.nickname,
            message: "",
            userId: userData.userId,
            longitude,
            latitude,
           
          };
          WebSocketManager.send(locationMessage);
  
          // 자신의 위치 업데이트
          setUserPositions((prevPositions) => ({
            ...prevPositions,
            [userData.userId]: {
              nickname: userData.nickname,
              latitude,
              longitude,
              userId: userData.userId,
            },
          }));
  
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
  
      // 5초마다 위치 정보 전송 (필요한 경우)
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
        }
      }, 5000);
    }
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isRunning, isWebSocketConnected, waitingRoomId, userData]);



  useEffect(() => {
    console.log("useEffect triggered with:", { userPositions, isRoomOwner, isRunning, roomOwnerId });

    const showNotification = (message) => {
      setNotification(message);
      playAlertSound(); // 소리 재생
    
      // 3초 후에 알림 사라지게 하기
      setTimeout(() => {
        setNotification(null);
      }, 3000);

      // 최근 알람 시간 갱신
      lastNotificationTime.current = Date.now();
    };

    if (isRoomOwner && isRunning) {
      console.log("isRoomOwner:", isRoomOwner);
      console.log("isRunning:", isRunning);
      const roomOwnerPosition = userPositions[roomOwnerId];  // 방장의 위치 가져오기
      console.log("roomOwnerPosition:", roomOwnerPosition);
      console.log("userPositions:", userPositions);

      if (!roomOwnerPosition) return; // 방장의 위치가 없으면 함수 종료

      // 거리 초과 사용자 이름 저장 배열
      const usersBeyondDistance = [];

      // 모든 사용자 위치를 반복문으로 조회
      for (const userId in userPositions) {
          // 방장의 위치를 제외한 사용자들의 위치만 비교
          if (userId !== roomOwnerId.toString()) {
              const userPosition = userPositions[userId];

              // 방장과 다른 사용자들 사이의 거리를 계산
              const distance = calculateDistance(
                  roomOwnerPosition.latitude,
                  roomOwnerPosition.longitude,
                  userPosition.latitude,
                  userPosition.longitude
              );

              // 계산된 거리 확인용 로그
              console.log(`Distance between ${roomOwnerPosition.nickname} and ${userPosition.nickname}: ${distance} meters`);

              // 거리가 30미터 이상 벌어졌을 경우 사용자 이름 추가
              if (distance > 30) {
                  usersBeyondDistance.push(userPosition.nickname);
              }
          }
      }

      // 거리 초과 사용자 이름들을 하나의 문자열로 결합
      if (usersBeyondDistance.length > 0) {
          const combinedNames = usersBeyondDistance.join(', ');
          const message = `${combinedNames} 님이 방장과 30m 이상 떨어졌습니다!`;
          
          // 마지막 알람으로부터 3초 이상 지났을 때만 알람 울리기
          const currentTime = Date.now();
          if (!lastNotificationTime.current || (currentTime - lastNotificationTime.current > 3000)) {
              showNotification(message);
          }
      }
  }
}, [userPositions, isRoomOwner, isRunning, roomOwnerId]);

  const handleLocationUpdate = (latitude, longitude, newDistance) => {
    if (newDistance !== undefined && newDistance !== null) {
      setDistance(newDistance);
      latestLocation.current = { latitude, longitude, distance: newDistance };
    }
  };

  const handleStartButtonClick = () => {
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

  const handleQuit = async () => {
    const result = await Swal.fire({
      title: "정말 종료하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "예, 종료합니다",
      cancelButtonText: "아니오, 계속하기",
      customClass: {
        popup: "custom-swal-popup2",
        title: "custom-swal-title2",
        confirmButton: "swal2-confirm2 swal2-styled2",
        cancelButton: "swal2-cancel2 swal2-styled2",
      },
    });

    if (result.isConfirmed) {
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
    navigate("/report-home");
  };

  const handleModalToggle = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  const teamCreatePageUrl = `https://i11e103.p.ssafy.io/team-create/${waitingRoomId}/${party}/${roomOwnerId}`;

 

  return (
    <div>
      {isCountdownVisible ? (
        <CountDown />
      ) : (
        <div>
          {isRunning ? (
            <>
              {countdownFinished && (
                <div className="TeamCreateContainer">
                  <div className="TeamCreateMap">
                    <MapComponent
                      positions={userPositions}
                      roomOwnerId={roomOwnerId}
                    />
                    {notification && (
                      <div className="notification">
                        {notification}
                      </div>
                    )}
                  </div>
                  <div className="TeamCreateButtonContainer">
                    {isRoomOwner && (
                      <button
                        onClick={handleQuit}
                        className="TeamCreateButton2"
                      >
                        <FontAwesomeIcon icon={faStop} size="2x" />
                      </button>
                    )}
                  </div>
                  <div className="TeamCreateRunning">
                    {countdownFinished && (
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
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="TeamCreate">
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
                {!isRunning && !isCountdownVisible && <TeamSaying />}
                {!isRunning && !isCountdownVisible && (
                  <TeamUserList userNames={userNames} />
                )}
                <div className="TeamCreateQR">
                  {!isRunning && isRoomOwner && (
                    <button
                      onClick={handleStartButtonClick}
                      className="TeamCreateButton"
                    >
                      <FontAwesomeIcon icon={faPlay} size="2x" />
                    </button>
                  )}
                  {!isRunning && (
                    <button
                      onClick={handleModalToggle}
                      className="TeamCreateButton"
                    >
                      QR코드
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
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
        </div>
      )}
    </div>
  );
};

export default TeamCreate;
