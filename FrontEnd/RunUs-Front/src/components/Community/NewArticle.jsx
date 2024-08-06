import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";
import "../../styles/Community/NewArticle.css";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";

const NewArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDay, setMeetingDay] = useState("");
  const [regionMinor, setRegionMinor] = useState("");
  const [regionMinorOptions, setRegionMinorOptions] = useState([]);
  const [regionMajor, setRegionMajor] = useState(null);
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData && userData.regionId) {
      // console.log("User Data in NewArticle:", userData);
      // console.log("User Region ID:", userData.regionId);
      const fetchRegionData = async () => {
        try {
          // 시/군/구의 정보를 가져옴
          const minorResponse = await axios.get(
            `/api/v1/region-minor/${userData.regionId}`
          );
          console.log(minorResponse.data);
          const minorData = minorResponse.data.data;

          // minorData가 배열이 아니라 단일 값이라면
          // const parentId = Array.isArray(minorData) ? minorData[0].parentId : minorData;
          const parentId = minorData.parentId;
          // console.log("Parent ID (Major ID):", parentId);

          if (!parentId) {
            console.error("Parent ID not found");
            return;
          }

          // parentId를 사용하여 시/도 정보를 가져옵니다.
          const majorResponse = await axios.get(
            `/api/v1/region-major/${parentId}`
          );
          const majorData = majorResponse.data.data;
          // console.log("Major Data:", majorData);

          if (majorData) {
            setRegionMajor(majorData);

            // 시/도 목록을 시/군/구 선택 옵션으로 설정
            setRegionMinorOptions(majorData);
          } else {
            console.error("Major data not found for the given parentId");
          }
        } catch (error) {
          console.error("Error fetching region data:", error);
        }
      };

      fetchRegionData();
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
        regionId: parseInt(regionMinor, 10), // Ensure regionMinor is an integer
        meetingTime: formattedMeetingTime, // Send as formatted string
        meetingDay, // Send as it is
        userId: userData.userId,
        nickname: userData.nickname,
        is_deleted: '0'
      }, {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );

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
      <Header/>
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
          <div className="form-group">
            <label htmlFor="regionMinor">시/군/구</label>
            <select
              id="regionMinor"
              value={regionMinor}
              onChange={(e) => setRegionMinor(e.target.value)}
              required
            >
              <option value="">시/군/구 선택</option>
              {regionMinorOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">등록</button>
        </form>
      </div>
    </div>
  );
};

export default NewArticle;
