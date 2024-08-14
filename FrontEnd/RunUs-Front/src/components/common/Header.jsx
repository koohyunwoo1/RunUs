import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Common/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons"; // 왼쪽 화살표 아이콘 import
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

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <>
      <div className="header2">
        <div className="header-left">
          {location.pathname === "/article-create"  || location.pathname.includes("/article-edit") ? (
            <FontAwesomeIcon
              icon={faTimes}
              className="header-X-button"
              onClick={handleBackClick}
            />
          ) : location.pathname.startsWith("/article-detail") ? (
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="header-back-arrow"
              onClick={handleBackClick}
            />
          ) : (
            <img
              src={logo}
              alt="Logo"
              className="Header-logo"
              onClick={handleLogoClick}
            />
          )}
        </div>
        {location.pathname === "/article-create" && (
          <span className="header-title">글쓰기</span>
        )}
        {location.pathname.includes("/article-edit") && (
          <span className="header-title">수정하기</span>
          
        )}
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
