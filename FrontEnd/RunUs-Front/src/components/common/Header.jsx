import React, { useState } from "react";
import "../../styles/Common/Header.css";
import logo from "../../assets/Logo.png";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className={`header2 ${isDropdownOpen ? "transparent" : ""}`}>
        <img src={logo} alt="Logo" className="Header-logo" />
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
          <h1 className="category-item">Report</h1>
          <h1 className="category-item">Run</h1>
          <h1 className="category-item">Community</h1>
          <h1 className="category-item">My Page</h1>
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
