import React, { useEffect, useState, useContext } from "react";
import Header from "../../components/common/Header";
import "../../styles/Community/ArticleHome.css";
import ArticleList from "../../components/Community/ArticleList";
import axios from "axios";
import Button from "../../components/common/Button";
import { UserContext } from "../../hooks/UserContext";

const ArticleHome = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const [sortByTime, setSortByTime] = useState(false); // 시간 순 정렬
  const [completedOnly, setCompletedOnly] = useState(false); // 완료 필터링
  const { userData } = useContext(UserContext); // UserContext에서 사용자 정보 가져오기

  const size = 10; // 페이지당 게시글 수

  console.log('UserData:', userData); // 사용자 데이터 로그 확인

  // 게시글을 가져오는 함수
  const fetchArticles = async () => {
    console.log('Fetching Articles...');
    if (!userData || !userData.regionId) return; // userData나 regionId가 없으면 종료

    setLoading(true);
    try {
      let url = `/api/v1/boards/region/${userData.regionId}`;
      if (completedOnly) {
        url += "/incomplete";
      } else if (sortByTime) {
        url += "/time";
      }

      const response = await axios.get(url, {
        params: { size, page },
      });

      // 삭제된 게시글 필터링
      const filteredArticles = response.data.data.filter(article => article.isDeleted !== 1);
      console.log("filtered : ", filteredArticles)
      setArticles(filteredArticles);
      setTotalPages(response.data.totalPages || 1); // 총 페이지 수 설정
      console.log('Articles Response:', response);
      console.log('Articles Data:', filteredArticles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 데이터가 변경될 때 게시글을 가져옵니다.
  useEffect(() => {
    if (userData && userData.regionId) {
      fetchArticles();
    }
  }, [userData, page, sortByTime, completedOnly]);

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
            onClick={() => setPage(prev => Math.max(prev - 1, 0))} 
            disabled={page === 0}
            text="이전" 
          />
          <span>Page {page + 1} of {totalPages}</span>
          <Button 
            onClick={() => setPage(prev => prev + 1)} 
            disabled={page >= totalPages - 1}
            text="다음"
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleHome;
