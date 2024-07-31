import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home/LogInHome.css";
import Header from "../../components/common/Header";
import ReportItem from "../../components/Report/ReportItem";
import Button2 from "../../components/common/Button2";
import SoloProfile from "../../assets/SoloProfile.png";
import TeamProfile from "../../assets/TeamProfile.png";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";
import Weather from "../../components/common/Weather";

const LogInHome = () => {
  const [showTeamOptions, setShowTeamOptions] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [distance, setDistance] = useState("0km"); // 기본값
  const teamProfileRef = useRef(null);
  const navigate = useNavigate();
  const { userData, addUserToRoom } = useContext(UserContext);

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

  const handleCreateTeamClick = async () => {
    try {
      const requestBody = {
        ownerUserId: userData.userId,
        regionId: userData.regionId,
      };
      const response = await axios.post("api/v1/team/create_room", requestBody);
      const { roomId } = response.data.data;
      addUserToRoom({
        userId: userData.userId,
        nickname: userData.nickname,
      });
      navigate(`/team-create/${roomId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinTeamClick = () => {
    navigate("/team-QR");
  };

  const handleSoloProfileClick = () => {
    navigate("/solo");
  };

  const updateDistance = (newDistance) => {
    setDistance(newDistance);
  };

  return (
    <div>
      <Header />
      <div className="LoginHome-container">
        <h3 className="Today_item">Today</h3>
        <h1 className="Today_km">{distance}</h1>
        <Weather />
        <div className="LoginHomeReportItem">
          <ReportItem onDistanceChange={updateDistance} />
        </div>
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
