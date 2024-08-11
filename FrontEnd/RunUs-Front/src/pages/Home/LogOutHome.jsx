import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home/LogOutHome.css";

const LogOutHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signin");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="LogOutHomeContainer">
      <div className="LogOutHome">
        함께 뛰는 즐거움
        <div className="LogOutHomeRunus">Run Us</div>
      </div>
    </div>
  );
};

export default LogOutHome;
