import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Common/TabBar.css";
import homeIcon from "../../assets/home.png";
import reportIcon from "../../assets/report.png";
import runIcon from "../../assets/speed.png";
import communityIcon from "../../assets/group.png";
import profileIcon from "../../assets/user.png";

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <div className="tab-bar">
      <div
        className={`tab-item ${location.pathname === "/home" ? "active" : ""}`}
        onClick={() => handleTabClick("/home")}
      >
        <img src={homeIcon} alt="Home" />
        <span>홈</span>
      </div>
      <div
        className={`tab-item ${location.pathname === "/report-home" ? "active" : ""}`}
        onClick={() => handleTabClick("/report-home")}
      >
        <img src={reportIcon} alt="Report" />
        <span>리포트</span>
      </div>
      <div
        className={`tab-item ${location.pathname === "/run" ? "active" : ""}`}
        onClick={() => handleTabClick("/run")}
      >
        <img src={runIcon} alt="Run" />
        <span>Run</span>
      </div>
      <div
        className={`tab-item ${location.pathname === "/article-home" ? "active" : ""}`}
        onClick={() => handleTabClick("/article-home")}
      >
        <img src={communityIcon} alt="Community" />
        <span>커뮤니티</span>
      </div>
      <div
        className={`tab-item ${location.pathname === "/my-page-home" ? "active" : ""}`}
        onClick={() => handleTabClick("/my-page-home")}
      >
        <img src={profileIcon} alt="Profile" />
        <span>프로필</span>
      </div>
    </div>
  );
};

export default TabBar;
