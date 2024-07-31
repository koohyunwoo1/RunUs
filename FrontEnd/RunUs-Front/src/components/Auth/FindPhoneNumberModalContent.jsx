import React, { useState } from "react";
import axios from "axios";
import "../../styles/Auth/Modal.css";

const FindPhoneNumberModalContent = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    // Remove all non-digit characters
    const onlyNums = value.replace(/\D/g, "");
    let formattedValue = onlyNums;

    if (onlyNums.length <= 3) {
      formattedValue = onlyNums;
    } else if (onlyNums.length <= 7) {
      formattedValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
    } else {
      formattedValue = `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
    }

    setPhoneNumber(formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/v1/search-email", {
        params: { phoneNumber } // Send phone number with hyphens
      });
      if (response.data.success) {
        setError("")
        setEmail(response.data.data.email);
        console.log("Email found:", response.data.data.email);
      } else {
        setError(response.data.message || "이메일을 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error(err);
      setEmail("")
      setError("없는 휴대폰 번호입니다.");
    }
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
          onChange={handleChange}
          required
          className="modal-input"
        />
        {email && <p>찾은 이메일: {email}</p>}
        {error && <p>{error}</p>}
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
