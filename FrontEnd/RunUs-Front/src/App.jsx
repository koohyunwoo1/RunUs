import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import LogOutHome from "./pages/Home/LogOutHome";
import LogInHome from "./pages/Home/LogInHome";
import CheckGeo from "./pages/Home/CheckGeo";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LogOutHome />} />
        <Route path="/home" element={<LogInHome />} />
        <Route path="/check" element={<CheckGeo />} />
      </Routes>
    </div>
  );
};

export default App;
