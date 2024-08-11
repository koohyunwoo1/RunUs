import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Common/CustomSwal.css";

// fcm setteing
import {
  requestPermissionAndGetToken,
  sendTokenToServer,
  deleteTokenFromServer,
} from "./fcm";
// fcm setting end

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [roomUsers, setRoomUsers] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/api/v1/signin", { email, password });
      if (response.data.success) {
        setUserId(response.data.data.userId);
        const data = response.data.data;
        setUserData(data);
        navigate("/home");
        localStorage.setItem("AuthToken", response.data.token);
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("userData", JSON.stringify(data));
        console.log("Logged in userData:", data); // 로그인 후 userData 확인

        // fcm code
        // FCM 토큰 요청 및 서버로 전송
        const fcmToken = await requestPermissionAndGetToken(
          response.data.data.userId
        );
        if (fcmToken) {
          console.log("FCM token obtained and sent to server");
        } else {
          console.log("Failed to obtain or send FCM token");
        }
        // fcm code end
      } else {
        setError(
          response.data.message || "이메일 또는 비밀번호가 일치하지 않습니다."
        );
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "이메일 또는 비밀번호가 일치하지 않습니다.",
          customClass: {
            popup: "custom-swal-popup",
            title: "custom-swal-title",
            confirmButton: "custom-swal-confirm-button",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: "이메일 또는 비밀번호가 일치하지 않습니다.",
        customClass: {
          popup: "custom-swal-popup",
          title: "custom-swal-title",
          confirmButton: "custom-swal-confirm-button",
        },
      });
    }
  };

  const logoutUser = async () => {
    try {
      const response = await axios.post("/api/v1/signout");
      if (response.data.success) {
        // fcm code
        await deleteTokenFromServer(userId);
        // fcm code end

        localStorage.removeItem("AuthToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
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

  // WebSocket 관련 상태 및 함수들
  const reconnectInterval = 1000;
  const maxReconnectAttempts = 100;
  let reconnectAttempts = 0;

  const initializeWebSocket = (roomId) => {
    const wsUrl = `https://i11e103.p.ssafy.io:8004/ws/chat?roomId=${roomId}`;
    document.getElementById("websocket-url").textContent = wsUrl;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log(
        `WebSocket 연결이 열렸습니다: ${userData.username} (ID: ${userId})`
      );
      const message = {
        type: "ENTER",
        roomId: roomId,
        sender: userData.username,
        message: "",
        userId: userId,
      };
      socketRef.current.send(JSON.stringify(message));
      reconnectAttempts = 0;
    };

    socketRef.current.onmessage = (event) => {
      try {
        const chatMessage = JSON.parse(event.data);
        handleMessage(chatMessage);
      } catch (error) {
        console.error("메시지 파싱 실패:", event.data, error);
      }
    };

    socketRef.current.onclose = (event) => {
      console.log(
        `WebSocket 연결이 닫혔습니다. 코드: ${event.code}, 이유: ${event.reason}`
      );
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          console.log("재연결 시도 중...");
          reconnectAttempts++;
          initializeWebSocket(roomId);
        }, reconnectInterval);
      } else {
        console.error("최대 재연결 시도 횟수에 도달했습니다.");
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };
  };

  const handleMessage = (chatMessage) => {
    if (chatMessage.type === "TALK") {
      setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
    } else if (chatMessage.type === "USERLIST_UPDATE") {
      const users = chatMessage.message.split(": ")[1].split(", ");
      updateUsersList(users);
    } else if (chatMessage.type === "TOTAL_DISTANCE") {
      document.getElementById("total-distances").textContent =
        chatMessage.message;
    } else if (chatMessage.type === "LOCATION") {
      // 위치 업데이트 처리
    } else if (chatMessage.type === "START") {
      // 세션 시작 처리
    } else if (chatMessage.type === "ROOM_CLOSED") {
      alert(chatMessage.message); // 방 종료 메시지 표시
      navigate("/home"); // 방 종료 후 홈으로 이동
    }
  };

  const updateUsersList = (users) => {
    users.forEach((user) => {
      addUserToRoom({ username: user, userId: user });
    });
  };

  const sendMessage = () => {
    const chatMessage = {
      type: "TALK",
      roomId: roomId,
      sender: userData.username,
      message: message,
      userId: userId,
    };

    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(chatMessage));
      console.log(`메시지 전송: ${JSON.stringify(chatMessage)}`);
      setMessage("");
    } else {
      console.warn("WebSocket 연결이 열려있지 않습니다.");
    }
  };

  const startSession = () => {
    const startMessage = {
      type: "START",
      roomId: roomId,
      sender: userData.username,
      message: "",
      userId: userId,
    };

    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(startMessage));
      console.log("세션 시작 메시지 전송");
      setSessionStarted(true);
    } else {
      console.warn("WebSocket 연결이 열려있지 않습니다.");
    }
  };

  const endSession = () => {
    const endMessage = {
      type: "QUIT",
      roomId: roomId,
      sender: userData.username,
      message: "",
      userId: userId,
    };
    if (socketRef.current.readyState === WebSocket.OPEN) {
      if (!sessionStarted) {
        socketRef.current.send(
          JSON.stringify({ ...endMessage, type: "WAIT_EXIT" })
        );
      } else {
        socketRef.current.send(
          JSON.stringify({ ...endMessage, type: "RUN_EXIT" })
        );
      }
      socketRef.current.close();
    }
  };

  const leaveRoom = () => {
    const leaveMessage = {
      type: sessionStarted ? "RUN_EXIT" : "WAIT_EXIT",
      roomId: roomId,
      sender: userData.username,
      message: "",
      userId: userId,
    };
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(leaveMessage));
      console.log("방 나가기 메시지 전송");
      socketRef.current.close();
    }
  };

  const handleRoomEntry = (enteredRoomId) => {
    if (!enteredRoomId) {
      alert("방 이름을 입력하세요.");
      return;
    }
    setRoomId(enteredRoomId);
    initializeWebSocket(enteredRoomId);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        userId,
        error,
        roomUsers,
        addUserToRoom,
        loginUser,
        logoutUser,
        registerUser,
        handleRoomEntry,
        message,
        setMessage,
        sendMessage,
        chatMessages,
        startSession,
        endSession,
        leaveRoom,
        sessionStarted,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
