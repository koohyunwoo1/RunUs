import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Community/ArticleDetail.css";
import CommentSection from "../../components/Community/CommentSection";
import Button from "../../components/common/Button";
import { UserContext } from "../../hooks/UserContext";
import TabBar from "../../components/common/TabBar";

// 날짜와 시간을 포맷하는 함수
const formatDate = (dateString) => {
  if (!dateString) return "미정"; // dateString이 없는 경우 처리

  try {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false // 24시간제 사용
    };
    return new Date(dateString).toLocaleString(undefined, options);
  } catch (error) {
    console.error('Date formatting error:', error);
    return "형식 오류";
  }
};

const ArticleDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { userData } = useContext(UserContext); // UserContext에서 사용자 데이터 가져오기
  const [article, setArticle] = useState(null);
  const [regionName, setRegionName] = useState('미정');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false); // 현재 사용자가 글 작성자인지 여부

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
        setArticle(response.data.data);

        // Fetch region name
        const regionResponse = await axios.get(`/api/v1/region-minor/${response.data.data.regionId}`);
        console.log('Region response:', regionResponse.data);
        if (regionResponse.data.success) {
          setRegionName(regionResponse.data.data.name || '미정');
        }

        // Check if the current user is the author of the article
        if (userData && response.data.data.nickname) {
          setIsAuthor(response.data.data.nickname === userData.nickname);
        }
      } catch (err) {
        console.error('Error fetching article or region:', err.response ? err.response.data : err.message);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, userData]);

  const handleEdit = () => {
    nav(`/article-edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/v1/boards/${id}`);
        nav("/article-home");
      } catch (err) {
        console.error('Error deleting article:', err.response ? err.response.data : err.message);
        setError(err);
      }
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>문제가 발생했습니다: {error.message}</p>;
  if (!article) return <p>글을 찾을 수 없습니다.</p>;

  return (
    <div><TabBar />
    <div className="article-detail-container">
      
      <h1>{article.title}</h1>

    <div className="author">
      <p>
        <strong>작성자:</strong> {article.nickname || "익명"}
      </p>
      <p>
        <strong>작성 시간:</strong> {formatDate(article.createdAt)}
      </p>
    </div>
      
      <div className="article-content">
        <p>
          <strong>출발 시간 :</strong> {article.meetingTime ? formatDate(article.meetingTime) : "미정"}
        </p>
        <p>
          <strong>장소 :</strong> {regionName}
        </p>
        <br/>
          {article.content}
      </div>
      {isAuthor && (
        <div className="board-button-container">
          <Button
            text="수정"
            onClick={handleEdit}
            className="article-edit-button"
          />
          <Button
            text="삭제"
            onClick={handleDelete}
            className="article-delete-button"
          />
        </div>
      )}
      <CommentSection comments={comments} articleId={id} />
      <Button text="목록" onClick={() => nav("/article-home")} />
    </div>
    </div>
  );
};

export default ArticleDetail;
