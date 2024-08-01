import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지 로드 시 로컬에서 사용자 데이터 가져옴
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/api/v1/signin", { email, password });
      console.log(response);
      if (response.data.success) {
        setUserId(response.data.data.userId);
        const data = response.data.data;
        setUserData(data);
        navigate("/home");
        localStorage.setItem("AuthToken", response.data.token);
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("userData", JSON.stringify(data));
        console.log("Logged in userData:", data); // 로그인 후 userData 확인
      } else {
        setError(
          response.data.message || "이메일 또는 비밀번호가 일치하지 않습니다."
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axios.post("/api/v1/signout");
      if (response.data.success) {
        localStorage.removeItem("AuthToken");
        localStorage.removeItem("userId");
        setUserData(null);
        setUserId(null);
        setRoomUsers([]);
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

  const addUserToRoom = (user) => {
    setRoomUsers((prevUsers) => {
      const exists = prevUsers.some((u) => u.userId === user.userId);
      if (!exists) {
        return [...prevUsers, user];
      }
      return prevUsers;
    });
  };

  console.log(roomUsers);
  return (
    <UserContext.Provider
      value={{
        userData,
        userId,
        error,
        roomUsers,
        addUserToRoom,
        loginUser,
        logoutUser,
        registerUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
