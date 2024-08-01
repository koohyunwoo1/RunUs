import React, { useContext } from "react";
import "../../../styles/Running/Team/TeamUserList.css";
import { UserContext } from "../../../hooks/UserContext";

const TeamUserList = () => {
  const { roomUsers } = useContext(UserContext);

  return (
    <div className="TeamUserList">
      <div className="user-list">
        {roomUsers.map((user) => (
          <div className="user-card" key={user.userId}>
            <div className="user-info">
              <span className="user-nickname">{user.nickname}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamUserList;
