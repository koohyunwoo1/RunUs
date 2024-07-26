import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth"; // 로그아웃 관련 유틸리티 함수 경로에 맞게 수정

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/api/v1/signin", { email, password });
      if (response.data.success) {
        setUserData(response.data.data); // userData 설정

        localStorage.setItem("AuthToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        // 로그인 후 필요한 작업 수행
        navigate("/home"); // 예: 대시보드로 이동
      } else {
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
        logout(); // 로컬 스토리지에서 사용자 정보 삭제 등
        navigate("/");
        setUserData(null); // userData 초기화
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
