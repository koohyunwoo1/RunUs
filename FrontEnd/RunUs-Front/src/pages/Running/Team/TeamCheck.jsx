import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../styles/Running/Team/TeamCheck.css";
import Header from "../../../components/common/Header";
import GeolocationComponent from "../../../components/Running/Team/GeolocationComponent";

const TeamCheck = () => {
  const location = useLocation();
  const [userNames, setUserNames] = useState([]);
  
  useEffect(() => {
    const storedUserNames = localStorage.getItem("userNames");
    if (storedUserNames) {
      setUserNames(JSON.parse(storedUserNames));
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="team-check-container">
        <div className="stats-container">
          <div className="stat-item">
            <h2>3.14</h2>
            <span>km</span>
          </div>
          <div className="stat-item">
            <h2>12.29</h2>
            <span>시간</span>
          </div>
          <div className="stat-item">
            <h2>212kcal</h2>
            <span>칼로리</span>
          </div>
        </div>
        <div className="distance-list">
          <h3>팀원 간 거리</h3>
          <ul>
            {userNames.map((name, index) => (
              <li key={index}>
                <span>{name}</span>
                <span>{(3.14 + index * 0.01).toFixed(2)}km</span>
                <button>❌</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="control-buttons">
          <button className="pause-button">⏸</button>
          <button className="stop-button">⏹</button>
        </div>
      </div>
    </div>
  );
};

export default TeamCheck;
