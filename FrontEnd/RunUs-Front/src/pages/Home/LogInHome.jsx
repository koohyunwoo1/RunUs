import "../../styles/Home/LogInHome.css";
import Header from "../../components/common/Header";
import ReportItem from "../../components/Report/ReportItem";
import Button2 from "../../components/common/Button2"
import SoloProfile from "../../assets/SoloProfile.png"
import TeamProfile from "../../assets/TeamProfile.png"
import QRCode from "qrcode.react";

const LogInHome = () => {

  return (
    <div>
      <Header />
      <div className="LoginHome-container">
        <h3 className="Today_item">Today</h3>
        <h1 className="Today_km">2.3km</h1>
        <ReportItem />
        <ReportItem />
        <ReportItem />
        <div className="MainButton-container">
          <Button2 src={SoloProfile}/>
          <Button2 src={TeamProfile}/>
        </div>
        
      </div>
    </div>
  );
};

export default LogInHome;
