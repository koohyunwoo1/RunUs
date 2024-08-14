import React, { useState, useEffect } from "react";
import "../../../styles/Running/Team/CountDown.css";

const CountDown = () => {
  const [countdown, setCountdown] = useState(3);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(timer);
          return 0;
        }
        setKey((prevKey) => prevKey + 1);
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    setCountdown(3);
  }, []);

  return (
    <div className={`container3 ${countdown > 0 ? "active" : ""}`}>
      {countdown > 0 && (
        <div className="countdown" key={key}>
          {countdown}
        </div>
      )}
    </div>
  );
};

export default CountDown;
