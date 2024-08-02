import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../styles/Running/Team/TeanCheck.css";
import Header from "../../../components/common/Header";

const TeamCheck = () => {
  const location = useLocation();
  const [userNames, setUserNames] = useState([]);
  useEffect(() => {
    // Retrieve userNames from sessionStorage
    const storedUserNames = localStorage.getItem("userNames");
    if (storedUserNames) {
      setUserNames(JSON.parse(storedUserNames));
    }

    // Clear userNames from sessionStorage after use
    // localStorage.removeItem('userNames');
  }, []);

  return (
    <div>
      <Header />
      <div className="TeamCheck">
        <h1>Team Check</h1>
        <ul>
          {userNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeamCheck;
