import React, { useState } from "react";
import "../../styles/Auth/Modal.css";

const FindPhoneNumberModalContent = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle phone number submission
    console.log("Phone number submitted:", phoneNumber);
    onClose();
  };

  return (
    <div>
      <h2>이메일 찾기</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone" className="modal-label">
          휴대폰 번호를 입력해주세요:
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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

export default FindPhoneNumberModalContent;
