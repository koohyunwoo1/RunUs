import React, { useState, useEffect } from 'react';
import Header from "../../../components/common/Header";
import "../../../styles/Running/Team/TeanCheck.css";
import Reverse from "../../../components/Running/Team/ReverseGeolocation";

const TeamCheck = () => {
  const [roomId, setRoomId] = useState(null);
  const [owner_user_id, setOwnerUserId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    // 예시 데이터: 실제로는 API 호출로부터 받아야 합니다.
    setRoomId("exampleRoomId");  // Room ID 설정
    setOwnerUserId("exampleOwnerId");  // 팀 리더 ID 설정
    setTeamMembers([
      { userId: "member1", name: "Member 1" },
      { userId: "member2", name: "Member 2" },
    ]);  // 팀 멤버 데이터 설정
  }, []);

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="TeamCheck">
        <Reverse 
          roomId={roomId}
          owner_user_id={owner_user_id}
          teamMembers={teamMembers}
        />
      </div>
    </div>
  );
};

export default TeamCheck;
