// src/components/Community/NewArticle.jsx
import "../../styles/Community/NewArticle.css"
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const NewArticle = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [region, setRegion] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/boards`, { title, content, departureTime, region });
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
          <label htmlFor="departureTime">출발 시간</label>
          <input
            id="departureTime"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
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
            <option value="서울">서울</option>
            <option value="부산">부산</option>
            <option value="대구">대구</option>
            <option value="인천">인천</option>
            <option value="광주">광주</option>
            <option value="대전">대전</option>
            <option value="울산">울산</option>
            <option value="세종">세종</option>
            <option value="경기">경기</option>
            <option value="강원">강원</option>
            <option value="충북">충북</option>
            <option value="충남">충남</option>
            <option value="전북">전북</option>
            <option value="전남">전남</option>
            <option value="경북">경북</option>
            <option value="경남">경남</option>
            <option value="제주">제주</option>
          </select>
        </div>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default NewArticle;
