import React, { useState } from "react";
import axios from "axios";
import "../../styles/Auth/Modal.css";

const FindPhoneNumberModalContent = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailFound, setEmailFound] = useState(false); // 이메일 발견 여부 상태 추가

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
        setEmail(response.data.data.email);
        setError("");
        setEmailFound(true); // 이메일 발견 상태 업데이트
      } else {
        setError(response.data.message || "이메일을 찾을 수 없습니다.");
        setEmail("");
        setEmailFound(false); // 이메일 발견 상태 업데이트
      }
    } catch (err) {
      console.error(err);
      setEmail("");
      setError("없는 휴대폰 번호입니다.");
      setEmailFound(false); // 이메일 발견 상태 업데이트
    }
  };

  return (
    <div>
      <h2>이메일 찾기</h2>
      <div className="writingplace">
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
          <div>
            {email && <p className="foundmail">찾은 이메일: {email}</p>}
            {email && <p><button type="button" onClick={onClose} className="modal-button">닫기</button></p>}
          </div>
          <div>
            {error && <p className="error-message">{error}</p>}
          </div>
          {!emailFound && ( // 이메일 발견되지 않았을 때만 버튼 표시
          
            <div className="modal-find-mail">
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
          )}
        </form>
      </div>
    </div>
  );
};

export default FindPhoneNumberModalContent;
