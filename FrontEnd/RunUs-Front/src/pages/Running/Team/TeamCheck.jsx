import React, { useState, useEffect } from "react";
import Header from "../../../components/common/Header";
import "../../../styles/Running/Team/TeanCheck.css";
import Reverse from "../../../components/Running/Team/ReverseGeolocation";
import { useParams } from "react-router-dom";

const TeamCheck = () => {
  const { id } = useParams();
  const [roomId, setRoomId] = useState(id || null);
  const [ownerUserId, setOwnerUserId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    if (roomId) {
      const ws = new WebSocket(`ws://localhost:8080/ws/chat?roomId=${roomId}`);

      ws.onopen = () => {
        console.log("WebSocket connection opened");
        ws.send(JSON.stringify({ type: "ENTER", content: "ㅎㅇㅎㅇ" }));
      };

      ws.onmessage = (event) => {
        const receivedData = event.data;
        console.log("Received message:", receivedData);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      setWebSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [roomId]);

  useEffect(() => {
    setRoomId("exampleRoomId");
    setOwnerUserId("exampleOwnerId");
    setTeamMembers([
      { userId: "member1", name: "Member 1" },
      { userId: "member2", name: "Member 2" },
    ]);
  }, []);

  return (
    <div>
      <Header />
      <div className="TeamCheck">
        <Reverse
          roomId={roomId}
          owner_user_id={ownerUserId}
          teamMembers={teamMembers}
        />
      </div>
    </div>
  );
};

export default TeamCheck;
