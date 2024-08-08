import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Community/ArticleEdit.css"; // 스타일 파일 import
import Button from "../../components/common/Button";

const ArticleEdit = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [article, setArticle] = useState({
    title: "",
    content: "",
    regionId: null,
    meetingDay: "",
    meetingTime: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로컬 스토리지에서 사용자 데이터 가져오기
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!id) {
      console.error('Article ID is missing');
      setError(new Error('Article ID is missing'));
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      console.log('Fetching article with ID:', id);
      try {
        const response = await axios.get(`/api/v1/boards/${id}`);
        console.log('Article response:', response.data);
        const articleData = response.data.data;

        setArticle({
          ...articleData,
          regionId: userData.regionId // 사용자 지역으로 설정
        });
      } catch (err) {
        console.error('Error fetching article:', err.response ? err.response.data : err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]); // userData를 종속성 배열에서 제거

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedMeetingTime = `${article.meetingDay}T${article.meetingTime}`;

      await axios.put(`/api/v1/boards/${id}`, {
        title: article.title,
        content: article.content,
        regionId: userData.regionId, // 자동으로 사용자 지역으로 설정
        userId: userData.userId, // userId 추가
        meetingDay: article.meetingDay,
        meetingTime: formattedMeetingTime
      });
      nav(`/article-detail/${id}`);
    } catch (err) {
      console.error("Update failed: ", err.response ? err.response.data : err.message);
      setError(err);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>문제가 발생했습니다: {error.message}</p>;

  return (
    <div className="ArticleEdit">
      <h2>글 수정하기</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={article.title}
            onChange={(e) => setArticle({ ...article, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={article.content}
            onChange={(e) => setArticle({ ...article, content: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="meetingDay">만나는 날짜</label>
          <input
            id="meetingDay"
            type="date"
            value={article.meetingDay}
            onChange={(e) => setArticle({ ...article, meetingDay: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="meetingTime">만나는 시간</label>
          <input
            id="meetingTime"
            type="time"
            value={article.meetingTime}
            onChange={(e) => setArticle({ ...article, meetingTime: e.target.value })}
            required
          />
        </div>
        {/* 지역 선택 요소 제거 */}
        <Button type="submit" text="저장" />
        <Button text="취소" onClick={() => nav(`/article-detail/${id}`)} />
      </form>
    </div>
  );
};

export default ArticleEdit;
