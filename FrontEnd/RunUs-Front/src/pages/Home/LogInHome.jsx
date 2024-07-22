import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 가져옵니다.
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
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.

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
    navigate("/team-create"); // 팀 생성 버튼 클릭 시 /team-create로 이동
  };

  const handleJoinTeamClick = () => {
    navigate("/team-join"); // 팀 입장 버튼 클릭 시 /team-join로 이동
  };

  const handleSoloProfilelick = () => {
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
          <Button2 src={SoloProfile} onClick={handleSoloProfilelick} />
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
