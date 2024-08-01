import React, { useState, useEffect } from "react";
import Header from "../../../components/common/Header";
import QRCode from "qrcode.react";
import "../../../styles/Running/Team/TeamCreate.css";
import { useNavigate, useParams } from "react-router-dom";
import TeamUserList from "../../../components/Running/Team/TeamUserList";
import TeamSaying from "../../../components/Running/Team/TeamSaying";
import Modal from "react-modal";

Modal.setAppElement("#root");

const TeamCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [waitingRoomId, setWaitingRoomId] = useState(id || null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    if (waitingRoomId) {
      const ws = new WebSocket(`ws://localhost:8080/ws/chat?roomId=${waitingRoomId}`);
      ws.onopen = () => {
        console.log("WebSocket connection opened");
        ws.send(JSON.stringify({ type: "ENTER", roomId: waitingRoomId, content: "ㅎㅇㅎㅇ" }));
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

      setWebSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [waitingRoomId]);

  const teamCreatePageUrl = `http://localhost:5173/team-create/${waitingRoomId}`;

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
          <TeamUserList />
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
