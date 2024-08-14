import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Community/ArticleDetail.css";
import CommentSection from "../../components/Community/CommentSection";
import Button from "../../components/common/Button";
import { UserContext } from "../../hooks/UserContext";
import TabBar from "../../components/common/TabBar";
import Header from "../../components/common/Header";
import "../../styles/MyPage/MyPageTier.css";

// 티어 정보
const tiers = [
  { name: "Unranked", min: 0, max: 49, color: "tier-unranked" },
  { name: "Bronze", min: 50, max: 349, color: "tier-bronze" },
  { name: "Silver", min: 350, max: 999, color: "tier-silver" },
  { name: "Gold", min: 1000, max: 1999, color: "tier-gold" },
  { name: "Platinum", min: 2000, max: 4999, color: "tier-platinum" },
  { name: "Diamond", min: 5000, max: Infinity, color: "tier-diamond" },
];

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
      hour12: false, // 24시간제 사용
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
  const { userData } = useContext(UserContext);
  const [article, setArticle] = useState(null);
  const [regionName, setRegionName] = useState('미정');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exp, setExp] = useState(0);
  const [comments, setComments] = useState([]);
  const [isAuthor, setIsAuthor] = useState(false);
  const [currentTier, setCurrentTier] = useState(tiers[0]);

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
        const exp = response.data.data.exp;
        console.log('Exp:', exp);
        setExp(exp);
        setArticle(response.data.data);

        // 티어 설정
        const tier = tiers.find((tier) => exp >= tier.min && exp <= tier.max);
        setCurrentTier(tier || tiers[tiers.length - 1]);

        // 지역 이름 가져오기
        const regionResponse = await axios.get(`/api/v1/region-minor/${response.data.data.regionId}`);
        console.log('Region response:', regionResponse.data);
        if (regionResponse.data.success) {
          setRegionName(regionResponse.data.data.name || '미정');
        }

        // 현재 사용자가 글 작성자인지 확인
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
    <div style={{ paddingTop: "60px", paddingBottom: "60px" }}>
      <Header />
      <div className="article-detail-container">
        <div className="author">
          <div className={`color-box ${currentTier.color}`}>{currentTier.color.slice(5, 6).toUpperCase()}</div>
          <div className="text-info">
            <p>
              <strong>{article.nickname || "익명"}</strong>
            </p>
            <p>{regionName}</p>
          </div>
        </div>

        <div className="title">
          <h2>{article.title}</h2>
          <p style={{ fontSize: "13px" }}>
            출발 시간 : {article.meetingTime ? formatDate(article.meetingTime) : "미정"}
          </p>
        </div>
        <div className="article-content">
          {article.content}
        </div>
        {/* currentTier.color를 CommentSection에 전달 */}
        <CommentSection comments={comments} articleId={id} tierColor={currentTier.color} />
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
      </div>
      <TabBar />
    </div>
  );
};

export default ArticleDetail;
