// src/components/Community/NewArticle.jsx
import "../../styles/Community/NewArticle.css"
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const NewArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingDay, setMeetingDay] = useState('');
  const [region, setRegion] = useState('');
  const nav = useNavigate();

  const regionOptions = [
    { label: "서울특별시", value: 11 },
    { label: "부산광역시", value: 12 },
    { label: "대구광역시", value: 13 },
    { label: "인천광역시", value: 14 },
    { label: "광주광역시", value: 15 },
    { label: "대전광역시", value: 16 },
    { label: "울산광역시", value: 17 },
    { label: "세종특별자치시", value: 18 },
    { label: "경기도", value: 19 },
    { label: "충청북도", value: 20 },
    { label: "충청남도", value: 21 },
    { label: "전라남도", value: 22 },
    { label: "경상북도", value: 23 },
    { label: "경상남도", value: 24 },
    { label: "제주특별자치도", value: 25 },
    { label: "강원특별자치도", value: 26 },
    { label: "전북특별자치도", value: 27 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/v1/boards`, {
        title,
        content,
        region: parseInt(region), // region 값을 숫자로 변환
        meetingTime,
        meetingDay
      });
      const newArticleId = response.data.id; // 서버로부터 응답으로 받은 새 글 ID
      nav(`/article-detail/${newArticleId}`); // 새 글의 상세 페이지로 이동
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  return (
    <div className="NewArticle">
      <h2>새 글 작성하기</h2>
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
          <label htmlFor="meetingDay">출발 날짜</label>
          <input
            id="meetingDay"
            type="date"
            value={meetingDay}
            onChange={(e) => setMeetingDay(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="region">사는 지역</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="">지역 선택</option>
            {regionOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default NewArticle;