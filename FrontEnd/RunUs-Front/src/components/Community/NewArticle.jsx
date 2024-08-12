import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";
import "../../styles/Community/NewArticle.css";
import { useNavigate } from "react-router-dom";
import TabBar from "../common/TabBar";

const NewArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDay, setMeetingDay] = useState("");
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  // 초기 로드 시 유저 지역 ID가 있는지 확인
  useEffect(() => {
    if (!userData || !userData.regionId) {
      console.error("User data or regionId is not available");
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // meetingTime과 meetingDay를 적절한 형식으로 변환
    const formattedMeetingTime = `${meetingDay}T${meetingTime}`; // 예: "2024-07-03T18:10:00"

    try {
      const response = await axios.post('/api/v1/boards', {
        title,
        content,
        regionId: userData.regionId, // 유저의 지역 ID를 사용
        meetingTime: formattedMeetingTime, // Send as formatted string
        meetingDay, // Send as it is
        userId: userData.userId,
        // nickname: userData.nickname,
        is_deleted: '0'
      }, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      // 로그를 통해 응답 데이터 확인
      console.log("API Response:", response.data);

      const newArticleId = response.data.data;

      if (newArticleId) {
        navigate(`/article-detail/${newArticleId}`); // Redirect to the article detail page
      } else {
        console.error("Article ID is missing in the response.");
      }
    } catch (error) {
      console.error("Error creating article:", error);
    }
  };

  return (
    <div>
      <div className="NewArticle">
        <h2>글쓰기</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              />
          </div>
          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              />
          </div>
          <div className="form-group">
            <label htmlFor="meetingDay">날짜</label>
            <input
              id="meetingDay"
              type="date"
              value={meetingDay}
              onChange={(e) => setMeetingDay(e.target.value)}
              required
              />
          </div>
          <div className="form-group">
            <label htmlFor="meetingTime">출발 시간</label>
            <input
              id="meetingTime"
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              required
              />
          </div>
          <button type="submit">등록</button>
        </form>
      </div>
    <TabBar/>
    </div>
  );
};

export default NewArticle;
