import React, { useState, useEffect, useContext } from "react";
import Header from "../../../components/common/Header";
import QRCode from "qrcode.react";
import "../../../styles/Running/Team/TeamCreate.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TeamUserList from "../../../components/Running/Team/TeamUserList";
import TeamSaying from "../../../components/Running/Team/TeamSaying";
import Modal from "react-modal";
import { UserContext } from "../../../hooks/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement("#root");

const TeamCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useContext(UserContext);
  const [waitingRoomId, setWaitingRoomId] = useState(id || null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [webSocket, setWebSocket] = useState(null);
  const [userNames, setUserNames] = useState([]);
  const location = useLocation();
  const [roomOwnerId, setRoomOwnerId] = useState(
    location.state?.roomOwnerId || null
  );

  useEffect(() => {
    if (waitingRoomId) {
      const ws = new WebSocket(
        `wss://i11e103.p.ssafy.io:8001/ws/chat?roomId=${waitingRoomId}`
      );
      setWebSocket(ws);

      ws.onopen = () => {
        console.log("WebSocket connection opened");
        const message = {
          type: "ENTER",
          roomId: waitingRoomId,
          sender: userData.nickname,
          message: "",
          userId: userData.userId,
        };
        ws.send(JSON.stringify(message));
      };

      ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        console.log("Received message:", receivedData);

        if (receivedData.type === "USERLIST_UPDATE") {
          console.log("User list update message:", receivedData.message);

          const messageContent = receivedData.message;
          const userList = messageContent.split("현재 방에 있는 사용자: ")[1];
          const userNames = userList ? userList.split(", ") : [];
          localStorage.setItem("userNames", JSON.stringify(userNames));
          setUserNames(userNames);
          console.log("User list updated:", userNames);
        } else if (receivedData.type === "ROOM_CLOSED") {
          alert("방장이 방을 종료했습니다. 방을 나가겠습니다.");
          navigate("/home");
        } else if (receivedData.type === "START") {
          window.location.href = `/countdown/${waitingRoomId}`;
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        ws.close();
      };
    }
  }, [waitingRoomId, userData, navigate]);

  const teamCreatePageUrl = `https://i11e103.p.ssafy.io/team-create/${waitingRoomId}`;

  const handleQRCodeClick = () => {
    window.location.href = teamCreatePageUrl;
  };

  const handleStartButtonClick = () => {
    if (webSocket) {
      const startMessage = {
        type: "START",
        roomId: waitingRoomId,
        sender: userData.nickname,
        message: "",
        userId: userData.userId,
      };
  
      if (webSocket.readyState === WebSocket.OPEN) {
        // 3초 지연 후에 메시지 전송 및 페이지 리디렉션
        setTimeout(() => {
          webSocket.send(JSON.stringify(startMessage));
          console.log("START 메시지 전송");
          console.log(startMessage)
        }, 3000); 
        window.location.href = `/countdown/${waitingRoomId}`;
      } else {
        console.warn("WebSocket 연결이 열려있지 않거나 초기화되지 않았습니다.");
      }
    } else {
      console.warn("WebSocket 객체가 초기화되지 않았습니다.");
    }
  };
  
  const handleModalToggle = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  const handleLeaveRoom = () => {
    if (webSocket) {
      const leaveMessage = {
        type: "WAIT_EXIT",
        roomId: waitingRoomId,
        sender: userData.nickname,
        message: "",
        userId: userData.userId,
      };

      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify(leaveMessage));
        localStorage.removeItem("userNames");
        console.log("방 나가기 메시지 전송");
      } else {
        console.warn("WebSocket 연결이 열려있지 않거나 초기화되지 않았습니다.");
      }
      webSocket.close();
    } else {
      console.warn("WebSocket 객체가 초기화되지 않았습니다.");
    }
    navigate("/home");
  };

  const isRoomOwner = roomOwnerId === Number(localStorage.getItem("userId"));

  return (
    <div>
      <Header />
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
            onClick={handleQRCodeClick}
            style={{ cursor: "pointer", width: "300px", height: "300px" }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default TeamCreate;
