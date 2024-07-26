import React from "react";
import "../../../styles/Running/Team/TeamUserList.css";
import { UserContext } from "../../../hooks/UserContext";

// 임의의 유저를 받자
const users = [
  { id: 1, nickname: "윤지호" },
  { id: 2, nickname: "김구태" },
  { id: 3, nickname: "박재현" },
  { id: 4, nickname: "박지원" },
  { id: 5, nickname: "최민" },
  { id: 6, nickname: "이형준" },
];

const TeamUserList = () => {
  return (
    <div>
      <div className="TeamUserList">
        <div className="user-list">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <span className="user-nickname">{user.nickname}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamUserList;
