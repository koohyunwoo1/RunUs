import React, { useState } from "react";
import "../../styles/Auth/Modal.css";
import axios from "axios";

const FindEmailModalContent = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailFound, setEmailFound] = useState(false); // 이메일 발견 여부 상태 추가

  const handleChange = (e) => {
    const { value } = e.target;
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
      const requestBody = {
        email,
        phoneNumber,
      };

      const response = await axios.post("/api/v1/search-password", requestBody);
      if (response.data.success) {
        const retrievedPassword = response.data.data.password;
        setPassword(retrievedPassword);
        setError("");
        setEmailFound(true); // 이메일 발견 상태 업데이트
      } else {
        setPassword("");
        setError(response.data.message);
        setEmailFound(false); // 이메일 발견 상태 업데이트
      }
    } catch (error) {
      setPassword("");
      setError("휴대폰 번호 또는 이메일이 일치하지 않습니다.");
      setEmailFound(false); // 이메일 발견 상태 업데이트
      console.error(error);
    }
  };

  return (
    <div>
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleSubmit}>
        <div className="writing_email">
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
        </div>
        <div className="writing_number">
          <label htmlFor="phoneNumber" className="modal-label">
            휴대폰 번호를 입력해주세요:
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={handleChange}
            required
            className="modal-input"
            />
        </div>
        {password && <p>찾는 비밀번호: {password}</p>}
        {error && <p>{error}</p>}
        {/* {emailFound && <p>찾은 이메일: {email}</p>}  */}
        {!emailFound && ( // 이메일 발견되지 않았을 때만 버튼 표시
          <div className="modal-find-pw">
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
  );
};

export default FindEmailModalContent;
