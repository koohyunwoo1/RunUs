import React, { useState, useEffect } from "react";
import Header from "../../../components/common/Header";
import QRCode from "qrcode.react";
import "../../../styles/Running/Team/TeamCreate.css";
import Weather from "../../../components/common/Weather";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/common/Button";
const TeamCreate = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 처리합니다.
  const { id } = useParams(); // URL 파라미터에서 대기방 ID를 가져옵니다
  const [waitingRoomId, setWaitingRoomId] = useState(id || null);

  useEffect(() => {
    if (!id) {
      // 대기방 ID가 URL에 없으면 랜덤 생성 및 URL 업데이트
      const generateWaitingRoomId = () => {
        return Math.floor(Math.random() * 10000);
      };
      const newId = generateWaitingRoomId();
      setWaitingRoomId(newId);
    }
  }, [id]);

  const teamCreatePageUrl = `http://localhost:5173/team-create/${waitingRoomId}`;

  const handleQRCodeClick = () => {
    window.location.href = teamCreatePageUrl;
  };

  const handleStartButtonClick = () => {
    navigate(`/countdown/${waitingRoomId}`); // Countdown 페이지로 이동
  };

  return (
    <div>
      <Header />
      <div className="TeamCreate">
        <div>
          <Weather />
        </div>
        <h1>팀 생성/대기 페이지</h1>
        <div>
          {/* QR 코드 클릭 시 handleQRCodeClick 함수 호출 */}
          <QRCode
            value={teamCreatePageUrl}
            onClick={handleQRCodeClick}
            style={{ cursor: "pointer" }}
          />
        </div>
        <Button onClick={handleStartButtonClick} text={"시작"} />
        {/* <button onClick={handleStartButtonClick} className="start-button">
          시작
        </button> */}
      </div>
    </div>
  );
};

export default TeamCreate;
