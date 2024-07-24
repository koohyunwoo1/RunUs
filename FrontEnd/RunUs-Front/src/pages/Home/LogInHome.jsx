import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home/LogInHome.css";
import Header from "../../components/common/Header";
import ReportItem from "../../components/Report/ReportItem";
import Button2 from "../../components/common/Button2";
import SoloProfile from "../../assets/SoloProfile.png";
import TeamProfile from "../../assets/TeamProfile.png";

const LogInHome = () => {
  const [showTeamOptions, setShowTeamOptions] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const teamProfileRef = useRef(null);
  const navigate = useNavigate();

  const handleTeamProfileClick = () => {
    if (teamProfileRef.current) {
      const rect = teamProfileRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.top + window.scrollY - rect.height,
        left: rect.left + window.scrollX,
      });
    }
    setShowTeamOptions(!showTeamOptions);
  };

  const handleCreateTeamClick = () => {
    const generateRandomId = () => Math.floor(Math.random() * 10000); // 0-9999 사이의 랜덤 숫자
    const id = generateRandomId();
    // 대기방 ID를 포함한 URL로 이동
    navigate(`/team-create/${id}`);
  };

  const handleJoinTeamClick = () => {
    navigate("/team-QR");
  };

  const handleSoloProfileClick = () => {
    navigate("/solo");
  };

  return (
    <div>
      <Header />
      <div className="LoginHome-container">
        <h3 className="Today_item">Today</h3>
        <h1 className="Today_km">2.3km</h1>
        <ReportItem />
        <ReportItem />
        <ReportItem />
        <div className="MainButton-container">
          <Button2 src={SoloProfile} onClick={handleSoloProfileClick} />
          <Button2
            src={TeamProfile}
            onClick={handleTeamProfileClick}
            ref={teamProfileRef}
          />
        </div>

        {showTeamOptions && (
          <div
            className="team-options-popup"
            style={{
              top: popupPosition.top - 10,
              left: popupPosition.left - 10,
            }}
          >
            <button onClick={handleCreateTeamClick}>팀 생성</button>
            <button onClick={handleJoinTeamClick}>팀 입장</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogInHome;
