import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth"; // 로그아웃 관련 유틸리티 함수 경로에 맞게 수정

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null); // userId 상태 추가
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/api/v1/signin", { email, password });
      if (response.data.success) {
        console.log(response.data);
        // 로그인 성공 시
        setUserId(response.data.data.userId); // userId 설정
        localStorage.setItem("AuthToken", response.data.token);
        console.log("TOken", response.data.token);
        localStorage.setItem("userId", response.data.data.userId);
        navigate("/home"); // 예: 대시보드로 이동
      } else {
        // 로그인 실패 시
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axios.post("/api/v1/signout");

      if (response.data.success) {
        // 로그아웃 성공
        logout(); // 로컬 스토리지에서 사용자 정보 삭제 등
        navigate("/");
        setUserId(null); // userId 초기화
      } else {
        console.error("로그아웃 실패", response.data.message);
      }
    } catch (error) {
      console.error("로그아웃 오류", error);
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post("/api/v1/signup", userData);

      if (response.data.success) {
        console.log("회원 가입 성공", response.data);
        navigate("/signin"); // 회원가입 후 로그인 페이지로 이동
      } else {
        console.error("회원 가입 실패", response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <UserContext.Provider
      value={{ userData, error, loginUser, logoutUser, registerUser, userId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
