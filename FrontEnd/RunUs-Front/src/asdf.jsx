import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import LogOutHome from "./pages/Home/LogOutHome";
import LogInHome from "./pages/Home/LogInHome";
import TeamCreate from "./pages/Running/Team/TeamCreate";
import ReportHome from "./pages/Report/ReportHome";
import ArticleHome from "./pages/Community/ArticleHome";
import ArticleEdit from "./pages/Community/ArticleEdit";
import MyPageHome from "./pages/MyPage/MyPageHome";
import SoloMode from "./pages/Running/Solo/SoloMode";
import TeamQR from "./pages/Running/Team/TeamQR";
import ArticleCreate from "./pages/Community/ArticleCreate";
import ArticleDetail from "./pages/Community/ArticleDetail";
import MyPageEdit from "./pages/MyPage/MyPageEdit";
import CountDown from "./pages/Running/Team/CountDown";
import TeamCheck from "./pages/Running/Team/TeamCheck";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { UserProvider } from "./hooks/UserContext";

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

const AppContent = () => {
  // firebase setting 
  import { useContext, useEffect } from "react";
  import { UserContext } from "./hooks/UserContext";
  import { requestPermissionAndGetToken, sendTokenToServer, deleteTokenFromServer, setupMessageListener } from './hooks/fcm';
  // firebase setting end

  const { userData, userId } = useContext(UserContext);
  
  useEffect(() => {
    let messageHandler;

    const setupFCM = async () => {
      if (userData) {
        const token = await requestPermissionAndGetToken();
        if (token) {
          await sendTokenToServer(userId, token);
          messageHandler = setupMessageListener();
        }
      } else if (messageHandler) {
        messageHandler();
        await deleteTokenFromServer(userId);
      }
    };

    setupFCM();

    return () => {
      if (messageHandler) {
        messageHandler();
      }
    };
  }, [userData, userId]);

  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LogOutHome />} />
        {/* 인증이 필요한 경로 */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <LogInHome />
            </ProtectedRoute>
          }
        />
        {/* ... 다른 라우트들 ... */}
      </Routes>
    </div>
  );
};

export default App;