import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate와 useLocation 훅을 가져옵니다.
import "../../styles/Common/Header.css";
import logo from "../../assets/Logo.png";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.
  const location = useLocation(); // useLocation 훅을 사용하여 현재 경로를 가져옵니다.

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleLogoClick = () => {
    navigate("/home");
    if (isDropdownOpen) toggleDropdown();
  };

  const handleReportClick = () => {
    if (location.pathname !== "/report-home") {
      navigate("/report-home");
    }
    if (isDropdownOpen) toggleDropdown();
  };

  const handleRunClick = () => {
    if (location.pathname !== "/home") {
      navigate("/home");
    }
    if (isDropdownOpen) toggleDropdown();
  };

  const handleCommunityClick = () => {
    if (location.pathname !== "/article-home") {
      navigate("/article-home");
    }
    if (isDropdownOpen) toggleDropdown();
  };

  const handleMyPageClick = () => {
    if (location.pathname !== "/my-page-home") {
      navigate("/my-page-home");
    }
    if (isDropdownOpen) toggleDropdown();
  };

  return (
    <>
      <div className={`header2 ${isDropdownOpen ? "transparent" : ""}`}>
        <img
          src={logo}
          alt="Logo"
          className="Header-logo"
          onClick={handleLogoClick} // 로고 클릭 시 handleLogoClick 호출
        />
        <button className="menu-button" onClick={toggleDropdown}>
          ≡
        </button>
      </div>

      <div className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
        <button className="close-button" onClick={toggleDropdown}>
          X
        </button>
        <div className="dropdown-content">
          <h1 className="category-item">LogOut</h1>
          <h1 className="category-item" onClick={handleReportClick}>
            Report
          </h1>
          <h1 className="category-item" onClick={handleRunClick}>
            Run
          </h1>
          <h1 className="category-item" onClick={handleCommunityClick}>
            Community
          </h1>
          <h1 className="category-item" onClick={handleMyPageClick}>
            My Page
          </h1>
        </div>
      </div>

      <div
        className={`overlay ${isDropdownOpen ? "visible" : ""}`}
        onClick={toggleDropdown}
      ></div>
    </>
  );
};

export default Header;
