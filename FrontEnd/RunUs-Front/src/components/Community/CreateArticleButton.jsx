import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons"; // 펜 아이콘을 사용
import "../../styles/Community/CreateArticleButton.css"; // 스타일 파일 임포트

const CreateArticleButton = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="create-article-button">
      <button onClick={handleClick} className="create-article-button-icon">
        <FontAwesomeIcon icon={faPen} />
      </button>
    </div>
  );
};

export default CreateArticleButton;
