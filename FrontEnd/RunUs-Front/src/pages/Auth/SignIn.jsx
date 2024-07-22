import React from "react";
import "../../styles/Auth/SignIn.css";
import LogOutHeader from "../../components/Home/LogOutHeader";
import Login from "../../components/Home/Login";
import SearchBar from "../../components/Auth/SearchBar";
const SignIn = () => {
  return (
    <div>
      <LogOutHeader />
      <div className="SignIn">
        <Login />
        <SearchBar />
      </div>
    </div>
  );
};

export default SignIn;
