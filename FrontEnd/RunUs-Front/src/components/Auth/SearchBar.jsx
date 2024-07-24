import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Import the Modal component
import FindEmailModalContent from "./FindEmailModalContent"; // Import the Email modal content component
import FindPhoneNumberModalContent from "./FindPhoneNumberModalContent"; // Import the Phone Number modal content component
import "../../styles/Auth/SearchBar.css";

const SearchBar = () => {
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const openModal = (ContentComponent) => {
    setModalContent(<ContentComponent onClose={closeModal} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="search-bar">
      <ul className="suggestions-list">
        <li onClick={() => openModal(FindPhoneNumberModalContent)}>
          이메일 찾기
        </li>
        <li onClick={() => openModal(FindEmailModalContent)}>비밀번호 찾기</li>
        <li onClick={handleSignUp}>회원가입</li>
      </ul>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default SearchBar;
