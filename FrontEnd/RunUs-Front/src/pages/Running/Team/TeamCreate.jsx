import React, { useState, useEffect } from "react";
import Header from "../../../components/common/Header";
import QRCode from "qrcode.react";
import "../../../styles/Running/Team/TeamCreate.css";
import Weather from "../../../components/common/Weather";
import { useNavigate, useParams } from "react-router-dom";
import TeamUserList from "../../../components/Running/Team/TeamUserList";
import TeamSaying from "../../../components/Running/Team/TeamSaying";
import Modal from "react-modal";

Modal.setAppElement("#root");

const TeamCreate = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 처리합니다.
  const { id } = useParams(); // URL 파라미터에서 대기방 ID를 가져옵니다
  const [waitingRoomId, setWaitingRoomId] = useState(id || null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [webSocket, setWebSocket] = useState(null);

  // useEffect(() => {
  //   const ws = new WebSocket(
  //     `ws://localhost:8080/ws/chat?roomId=${waitingRoomId}`
  //   ); // 웹소켓 서버 URL

  //   ws.onopen = () => {
  //     console.log("WebSocket connection opened");
  //     ws.send(JSON.stringify({ type: "message", content: "ㅎㅇㅎㅇ" })); // 메시지 전송
  //   };

  //   ws.onmessage = (event) => {
  //     const receivedData = event.data;
  //     console.log("Received message:", receivedData);
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   ws.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   setWebSocket(ws);

  //   return () => {
  //     ws.close();
  //   };
  // }, []);
  // 의존성 배열

  const teamCreatePageUrl = `http://localhost:5173/team-create/${waitingRoomId}`;

  // QR 코드 클릭 시 페이지 이동
  const handleQRCodeClick = () => {
    window.location.href = teamCreatePageUrl;
  };

  // 시작 버튼 눌렀을 시
  const handleStartButtonClick = () => {
    navigate(`/countdown/${waitingRoomId}`); // Countdown 페이지로 이동
  };

  // 모달 상태 변경
  const handleModalToggle = () => {
    setModalIsOpen((prevState) => !prevState);
  };

  return (
    <div>
      <Header />
      <div className="TeamCreate">
        <div>
          <Weather />
        </div>
        <div>
          <TeamSaying />
        </div>
        <div>
          <TeamUserList />
        </div>
        <div className="TeamCreateQR">
          <div>
            <button
              onClick={handleStartButtonClick}
              className="TeamCreateButton"
            >
              시작
            </button>
          </div>
          <div>
            <button onClick={handleModalToggle} className="TeamCreateButton">
              QR코드 보기
            </button>
          </div>
        </div>
        {/* 모달 컴포넌트 */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={handleModalToggle}
          contentLabel="QR Code Modal"
          className="TeamCreateModal"
          overlayClassName="TeamCreateOverlay"
          // 모달 외부 배경의 스타일을 정의
        >
          <QRCode
            value={teamCreatePageUrl}
            onClick={handleQRCodeClick}
            style={{ cursor: "pointer", width: "300px", height: "300px" }} // 원하는 크기로 조정
          />
        </Modal>
      </div>
    </div>
  );
};

export default TeamCreate;
