import React, { useEffect, useState, useContext } from "react";
import TabBar from "../../components/common/TabBar";
import "../../styles/Community/ArticleHome.css";
import ArticleList from "../../components/Community/ArticleList";
import axios from "axios";
import Button from "../../components/common/Button";
import { UserContext } from "../../hooks/UserContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Community/Pagination";

const ArticleHome = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByTime, setSortByTime] = useState(false);
  const [completedOnly, setCompletedOnly] = useState(false);
  const [word, setWord] = useState("");
  const [searchInitiated, setSearchInitiated] = useState(false);
  const { userData } = useContext(UserContext);
  const size = 10;
  const nav = useNavigate();

  const fetchArticles = async () => {
    if (!userData || !userData.regionId) return;

    setLoading(true);
    try {
      let url = `/api/v1/boards/region/${userData.regionId}`;
      if (completedOnly) {
        url += "/incomplete";
      } else if (sortByTime) {
        url += "/time";
      } else if (word) {
        url += `/${word}`;
      }

      const response = await axios.get(url, { params: { size, page } });
      const filteredArticles = response.data.data.filter(article => article.isDeleted !== 1);
      setArticles(filteredArticles);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchInitiated) {
      fetchArticles();
      setSearchInitiated(false);
    }
  }, [searchInitiated, page, sortByTime, completedOnly, userData, word]);

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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInitiated(true);
    setPage(0);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>문제가 발생했습니다: {error.message}</p>;

  return (
    <>
    <div>
    <div className="ArticleHome">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="검색어를 입력하세요"
          />
        <button type="submit">검색</button>
      </form>

        <div className="article-filters">
          <div className="left-buttons">
            <button onClick={handleCompletedOnly}>
              {completedOnly ? "모든 글 보기" : "모집 가능한 글 보기"}
            </button>
            <button onClick={handleSortByTime}>
              {sortByTime ? "오래된순" : "최신순"}
            </button>
          </div>
          <div className="right-button">  
            <Button
              className="article-create-button"
              text={"글 쓰기"} 
              onClick={() => nav('/article-create')}/>
          </div>
        </div>
      </div>

      <ArticleList articles={articles}/>
      <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
    </div>
      <TabBar />
  </>
  );
};

export default ArticleHome;
