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
  const [regionMinorOptions, setRegionMinorOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData")); // 로컬 스토리지에서 사용자 데이터 가져오기

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
        setArticle(articleData);

        // Fetch parentId from region-minor
        const minorResponse = await axios.get(`/api/v1/region-minor/${articleData.regionId}`);
        const minorData = minorResponse.data.data;
        const parentId = minorData.parentId;

        if (!parentId) {
          console.error('Parent ID not found');
          return;
        }

        // Fetch region-major using parentId
        const majorResponse = await axios.get(`/api/v1/region-major/${parentId}`);
        const majorData = majorResponse.data.data;

        if (majorData) {
          setRegionMinorOptions(majorData);
        } else {
          console.error('Major data not found for the given parentId');
        }
      } catch (err) {
        console.error('Error fetching article or region options:', err.response ? err.response.data : err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const formattedMeetingTime = `${article.meetingDay}T${article.meetingTime}`

      await axios.put(`/api/v1/boards/${id}`, {
        title: article.title,
        content: article.content,
        regionId: parseInt(article.regionId, 10),
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
        <div className="form-group">
          <label htmlFor="regionMinor">시/군/구</label>
          <select
            id="regionMinor"
            value={article.regionId || ""}
            onChange={(e) => setArticle({ ...article, regionId: e.target.value })}
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
        <Button type="submit" text="저장" />
        <Button text="취소" onClick={() => nav(`/article-detail/${id}`)} />
      </form>
    </div>
  );
};

export default ArticleEdit;
