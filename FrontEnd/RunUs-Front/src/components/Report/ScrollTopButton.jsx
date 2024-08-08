import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import "../../styles/Report/ScrollToTopButton.css"; // 이 CSS 파일을 새로 생성하세요

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      // 스크롤 위치가 300px을 초과하면 버튼을 표시
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      className={`scroll-to-top ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
    >
      <FaArrowUp size="24" />
    </button>
  );
};

export default ScrollToTopButton;
