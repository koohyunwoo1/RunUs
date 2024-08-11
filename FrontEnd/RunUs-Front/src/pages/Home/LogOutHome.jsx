import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home/LogOutHome.css";

const LogOutHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signin");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="LogOutHomeContainer">
      <div className="LogOutHome">
        <div className="Runsubtitle">R u n</div>
        <br />
        <div>
          <div className="Ussubtitle">U</div>
          <div className="Ussubtitle2">s</div>
        </div>
      </div>
    </div>
  );
};

export default LogOutHome;
