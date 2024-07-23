import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = () => {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/boards/1")
      .then((response) => {
        console.log(response.data.data);
        setBoard(response.data.data);
      })
      .catch((error) => {
        console.error(error);
        setBoard(null);
      });
  }, []);

  return (
    <div>
      <h1>Board Details</h1>
      {board ? (
        <ul>
          <li>Title: {board.title}</li>
          <li>Content: {board.content}</li>
          <li>Nickname: {board.nickname}</li>
          <li>Created At: {board.createdAt}</li>
          <li>Region: {board.region}</li>
          <li>Meeting Time: {board.meetingTime}</li>
          <li>Meeting Day: {board.meetingDay}</li>
        </ul>
      ) : (
        <p>No board found</p>
      )}
    </div>
  );
};

export default UserList;
