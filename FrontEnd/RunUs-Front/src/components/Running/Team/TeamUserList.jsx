import React from "react";
import "../../../styles/Running/Team/TeamUserList.css";

const TeamUserList = ({ userNames }) => {
  return (
    <div className="TeamUserList">
      <div className="user-list">
        {userNames.map((user, index) => (
          <div className="user-card" key={index}>
            <span className="user-nickname">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamUserList;
