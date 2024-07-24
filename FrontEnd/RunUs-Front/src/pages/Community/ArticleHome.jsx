import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import "../../styles/Community/ArticleHome.css";
import ArticleList from "../../components/Community/ArticleList";
import axios from "axios";
import Button from "../../components/common/Button";

const ArticleHome = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const [sortByTime, setSortByTime] = useState(false); // 시간 순 정렬
  const [completedOnly, setCompletedOnly] = useState(false); // 완료 필터링
  const regionId = 1; // 예시로 고정된 값
  const size = 10; // 페이지당 게시글 수

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/boards/region/${regionId}`;
      if (completedOnly) {
        url += "/incomplete";
      } else if (sortByTime) {
        url += "/time";
      }
      
      const response = await axios.get(url, {
        params: { size, page }
      });
      setArticles(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [regionId, page, sortByTime, completedOnly]);

  const handleSortByTime = () => {
    setSortByTime(prev => !prev);
  };

  const handleCompletedOnly = () => {
    setCompletedOnly(prev => !prev);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>문제가 발생했습니다: {error.message}</p>;
  if (articles.length === 0) return <p>게시글이 없습니다.</p>;

  return (
    <div>
      <Header />
      <div className="ArticleHome">
        <div className="article-filters">
          <button onClick={handleCompletedOnly}>
            {completedOnly ? "모든 글 보기" : "모집 완료된 글만 보기"}
          </button>
          <button onClick={handleSortByTime}>
            {sortByTime ? "시간순" : "최신순"}
          </button>
        </div>
        <ArticleList articles={articles} />
        <div className="pagination">
          <Button 
            onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
            disabled={page === 1}
            text="이전" 
            />
          <span>Page {page} of {totalPages}</span>
          <Button 
            onClick={() => setPage(prev => prev + 1)} 
            disabled={page === totalPages}
            text="다음"
            />
        </div>
      </div>
    </div>
  );
};

export default ArticleHome;
