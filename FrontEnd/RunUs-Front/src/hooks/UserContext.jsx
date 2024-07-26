import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/api/v1/signin", { email, password });
      if (response.data.success) {
        setUserId(response.data.data.userId);
        localStorage.setItem("AuthToken", response.data.token);
        localStorage.setItem("userId", response.data.data.userId);
        navigate("/home");
      } else {
        setError(
          response.data.message || "이메일 또는 비밀번호가 일치하지 않습니다."
        );
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
        localStorage.removeItem("AuthToken");
        localStorage.removeItem("userId");
        setUserId(null);
        navigate("/");
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
        navigate("/signin");
      } else {
        setError(response.data.message || "회원 가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <UserContext.Provider
      value={{ userId, error, loginUser, logoutUser, registerUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
