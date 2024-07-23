import "../../styles/Community/NewArticle.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button"

const regions = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

const NewArticle = () => {
  const [ title, setTitle] = useState('')
  const [ content, setContent ] = useState('')
  const [ departureTime, setDepartureTime ] = useState('')
  const [ region, setRegion ] = useState('')
  const nav = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const newArticleId = Math.floor(Math.random()*1000) // 임시 ID 생성

    nav(`/article-detail/${newArticleId}`)
  }

  return (
    <div className="new-article-container">
      <h1>새 글 작성</h1>
      <form onSubmit={handleSubmit} className="new-article-form">
        <div className="article-form-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="article-form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
          />
        </div>
        <div className="article-form-group">
          <label htmlFor="departureTime">출발 시간</label>
          <input
            id="departureTime"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </div>
        <div className="article-form-group">
          <label htmlFor="region">사는 지역</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          >
            <option value="">지역을 선택하세요</option>
            {regions.map((region, index) => (
              <option key={index} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <Button
          className="new-submit-button" 
          text="작성 완료" 
          type="submit" 
        />
      </form>
    </div>
  );
}

export default NewArticle