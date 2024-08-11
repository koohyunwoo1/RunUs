import React from "react";
import "../../styles/Home/LogInHome.css";
import TabBar from "../../components/common/TabBar";
import Weather from "../../components/common/Weather";
import LoginHomeMapView from "../../components/Home/LoginHomeMapView";
import Header from "../../components/common/Header";

const LogInHome = () => {
  return (
    <div>
      <Header />
      <div className="LoginHome-container">
        <Weather />
        <div className="LoginHomeMapView">
          <LoginHomeMapView />
        </div>
      </div>
      <TabBar />
    </div>
  );
};

export default LogInHome;
