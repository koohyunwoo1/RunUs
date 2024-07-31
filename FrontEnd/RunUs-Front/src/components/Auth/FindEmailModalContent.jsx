import React, { useState } from "react";
import "../../styles/Auth/Modal.css";

const FindEmailModalContent = ({ onClose }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    onClose();
  };

  return (
    <div>
      <h2>비밀번호</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email" className="modal-label">
          이메일을 입력해주세요:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="modal-input"
        />
        <div className="modal-buttons">
          <button type="submit" className="modal-button submit-button">
            제출
          </button>
          <button
            type="button"
            className="modal-button cancel-button"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default FindEmailModalContent;
