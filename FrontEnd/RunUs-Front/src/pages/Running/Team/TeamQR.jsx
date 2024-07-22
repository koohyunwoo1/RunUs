import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import "../../../styles/Running/Team/TeamQR.css";
import Header from "../../../components/common/Header";

const TeamQR = () => {
  const [data, setData] = useState("No result");

  const handleScan = (result) => {
    if (result && result.text) {
      const resultData = result.text;
      setData(resultData);

      if (isValidURL(resultData)) {
        window.location.href = resultData; // URL로 이동
      } else {
        console.log("Scanned result is not a valid URL:", resultData);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div>
      <Header />
      <h1 className="TeamQR">QR 코드를 찍어주세요!</h1>
      <div className="qr-reader-container">
        <QrScanner
          delay={100}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%", height: "100%" }} // 부모 컨테이너에서 높이를 조절
        />
      </div>
    </div>
  );
};

export default TeamQR;
