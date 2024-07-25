import { createContext, useState } from "react";
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
        // 로그인 성공 시
        // console.log("로그인 성공", response.data);
        setUserId(response.data.data.userId); // userId 설정

        console.log(response.data.data.userId);
        localStorage.setItem("AuthToken", response.data.token);
        localStorage.setItem("userId", response.data.data.userId);
        // 로그인 후 필요한 작업 수행
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
      // 로그아웃 요청을 서버로 보냄
      const response = await axios.post("/api/v1/signout");

      if (response.data.success) {
        // 로그아웃 성공
        console.log("로그아웃 성공", response.data);
        // 클라이언트 측에서 필요한 로그아웃 후처리
        logout(); // 로컬 스토리지에서 사용자 정보 삭제 등
        // 로그아웃된 홈으로 이동
        navigate("/");
        setUserId(null); // userId 초기화
      } else {
        console.error("로그아웃 실패", response.data.message);
      }
    } catch (error) {
      console.error("로그아웃 오류", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ userData, error, loginUser, logoutUser, userId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
