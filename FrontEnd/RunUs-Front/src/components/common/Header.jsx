import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate와 useLocation 훅을 가져옵니다.
import "../../styles/Common/Header.css";
import logo from "../../assets/Logo.png";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.
  const location = useLocation(); // useLocation 훅을 사용하여 현재 경로를 가져옵니다.

  const handleLogoClick = () => {
    navigate("/home");
  };

  return (
    <>
      <div className="header2">
        <img
          src={logo}
          alt="Logo"
          className="Header-logo"
          onClick={handleLogoClick} // 로고 클릭 시 handleLogoClick 호출
        />
      </div>
    </>
  );
};
export default Header;
