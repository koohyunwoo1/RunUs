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
      <div>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<LogOutHome />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <LogInHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/solo"
            element={
              <ProtectedRoute>
                <SoloMode />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-create/:id"
            element={
              <ProtectedRoute>
                <TeamCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/countdown/:id"
            element={
              <ProtectedRoute>
                <CountDown />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-QR"
            element={
              <ProtectedRoute>
                <TeamQR />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-home"
            element={
              <ProtectedRoute>
                <ReportHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article-home"
            element={
              <ProtectedRoute>
                <ArticleHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article-edit/:id"
            element={
              <ProtectedRoute>
                <ArticleEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-page-home"
            element={
              <ProtectedRoute>
                <MyPageHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article-create"
            element={
              <ProtectedRoute>
                <ArticleCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article-detail/:id"
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-page-edit"
            element={
              <ProtectedRoute>
                <MyPageEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-check/:id"
            element={
              <ProtectedRoute>
                <TeamCheck />
              </ProtectedRoute>
            }
          />
          
        </Routes>
      </div>
    </UserProvider>
  );
};

export default App;
