import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import LogOutHome from "./pages/Home/LogOutHome";
import LogInHome from "./pages/Home/LogInHome";
import TeamCreate from "./pages/Running/Team/TeamCreate";
import TeamJoin from "./pages/Running/Team/TeamJoin";
import ReportHome from "./pages/Report/ReportHome";
import ArticleHome from "./pages/Community/ArticleHome";
import MyPageHome from "./pages/MyPage/MyPageHome";
import SoloMode from "./pages/Running/Solo/SoloMode";
import TeamQR from "./pages/Running/Team/TeamQR";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LogOutHome />} />
        <Route path="/home" element={<LogInHome />} />
        <Route path="/solo" element={<SoloMode />} />
        <Route path="/team-create" element={<TeamCreate />} />
        <Route path="/team-QR" element={<TeamQR />} />
        <Route path="/team-join" element={<TeamJoin />} />
        <Route path="/report-home" element={<ReportHome />} />
        <Route path="/article-home" element={<ArticleHome />} />
        <Route path="/my-page-home" element={<MyPageHome />} />
      </Routes>
    </div>
  );
};

export default App;
