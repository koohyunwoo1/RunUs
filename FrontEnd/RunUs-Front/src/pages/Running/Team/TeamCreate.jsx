import React, { useState, useEffect, useContext } from "react";
import Header from "../../../components/common/Header";
import QRCode from "qrcode.react";
import "../../../styles/Running/Team/TeamCreate.css";
import { useNavigate, useParams } from "react-router-dom";
import TeamUserList from "../../../components/Running/Team/TeamUserList";
import TeamSaying from "../../../components/Running/Team/TeamSaying";
import Modal from "react-modal";
import { UserContext } from "../../../hooks/UserContext";

Modal.setAppElement("#root");

const TeamCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useContext(UserContext);
  const [waitingRoomId, setWaitingRoomId] = useState(id || null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [webSocket, setWebSocket] = useState(null);
  const [userNames, setUserNames] = useState([]); // 유저 이름을 저장할 상태 변수

  useEffect(() => {
    if (waitingRoomId) {
      const ws = new WebSocket(`wss://i11e103.p.ssafy.io:8001/ws/chat?roomId=${waitingRoomId}`);
      ws.onopen = () => {
        console.log("WebSocket connection opened");

        const message = {
          type: 'ENTER',
          roomId: waitingRoomId,
          sender: userData.nickname,
          message: '',
          userId: userData.userId
        };
        ws.send(JSON.stringify(message));
      };

      ws.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        console.log("Received message:", receivedData);

        if (receivedData.type === "USERLIST_UPDATE") {
          const messageContent = receivedData.message;
          const userList = messageContent.split("현재 방에 있는 사용자: ")[1];
          const userNames = userList ? userList.split(", ") : [];
          
          setUserNames(userNames); // 상태 변수 업데이트
          console.log("User list updated:", userNames);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setWebSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [waitingRoomId, userData]);

  const teamCreatePageUrl = `http://localhost:3000/team-create/${waitingRoomId}`;

  const handleQRCodeClick = () => {
    window.location.href = teamCreatePageUrl;
  };

  const handleStartButtonClick = () => {
    navigate(`/countdown/${waitingRoomId}`);
  };

  const handleModalToggle = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  return (
    <div>
      <Header />
      <div className="TeamCreate">
        <div>
          <TeamSaying />
        </div>
        <div>
          <TeamUserList userNames={userNames} /> {/* userNames를 prop으로 전달 */}
        </div>
        <div className="TeamCreateQR">
          <div>
            <button onClick={handleStartButtonClick} className="TeamCreateButton">
              시작
            </button>
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
