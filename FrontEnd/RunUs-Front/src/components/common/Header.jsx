import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Common/Header.css";
import logo from "../../assets/Logo.png";
import dodbogi from "../../assets/dodbogi.png";

const Header = ({ onSearch, searchValue, setSearchValue }) => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate("/home");
  };

  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <>
      <div className="header2">
        <img
          src={logo}
          alt="Logo"
          className="Header-logo"
          onClick={handleLogoClick}
        />
        {location.pathname === "/article-home" && (
          <button onClick={toggleSearch} className="header-search-toggle">
            <img
              src={dodbogi}
              alt="돋보기 아이콘"
              className="header-search-icon"
            />
          </button>
        )}
      </div>

      {isSearchVisible && (
        <div className="header-search-container">
          <form onSubmit={handleSearchSubmit} className="header-search-form">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="검색어를 입력해주세요."
              className="header-search-input"
            />
            <button type="submit" className="header-search-button">
              검색
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Header;
