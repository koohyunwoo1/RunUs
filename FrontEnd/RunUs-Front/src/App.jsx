import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import LogOutHome from "./pages/Home/LogOutHome";
import LogInHome from "./pages/Home/LogInHome";
import TeamCreate from "./pages/Running/Team/TeamCreate";
import ReportHome from "./pages/Report/ReportHome";
import ArticleHome from "./pages/Community/ArticleHome";
import MyPageHome from "./pages/MyPage/MyPageHome";
import SoloMode from "./pages/Running/Solo/SoloMode";
import TeamQR from "./pages/Running/Team/TeamQR";
import ArticleCreate from "./pages/Community/ArticleCreate";
import ArticleDetail from "./pages/Community/ArticleDetail";
import UserList from "./pages/UseList/UserList";
import MyPageEdit from "./pages/MyPage/MyPageEdit";
import CountDown from "./pages/Running/Team/CountDown";
import TeamCheck from "./pages/Running/Team/TeamCheck";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LogOutHome />} />
        <Route path="/home" element={<LogInHome />} />
        <Route path="/solo" element={<SoloMode />} />
        <Route path="/team-create/:id" element={<TeamCreate />} />
        <Route path="/countdown/:id" element={<CountDown />} />
        <Route path="/team-QR" element={<TeamQR />} />
        <Route path="/report-home" element={<ReportHome />} />
        <Route path="/article-home" element={<ArticleHome />} />
        <Route path="/my-page-home" element={<MyPageHome />} />
        <Route path="/article-create" element={<ArticleCreate />} />
        <Route path="/article-detail/:id" element={<ArticleDetail />} />
        <Route path="/UserList" element={<UserList />} />
        <Route path="/my-page-edit" element={<MyPageEdit />} />
        <Route path="/team-check/:id" element={<TeamCheck />} />
      </Routes>
    </div>
  );
};

export default App;
