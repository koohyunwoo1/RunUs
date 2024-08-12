import React, { useEffect, useState, useContext } from "react";
import TabBar from "../../components/common/TabBar";
import "../../styles/Community/ArticleHome.css";
import ArticleList from "../../components/Community/ArticleList";
import axios from "axios";
import { UserContext } from "../../hooks/UserContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Community/Pagination";
import Header from "../../components/common/Header";
import CreateArticleButton from "../../components/Community/CreateArticleButton";

const fetchRegionName = async (regionId) => {
  try {
    const response = await axios.get(`/api/v1/region-minor/${regionId}`);
    if (response.data.success) {
      return response.data.data.name || "미정";
    }
  } catch (error) {
    console.error("지역 이름 가져오기 오류:", error);
  }
  return "미정";
};

const ArticleHome = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByTime, setSortByTime] = useState(false);
  const [completedOnly, setCompletedOnly] = useState(false);
  const [word, setWord] = useState("");
  const [regionName, setRegionName] = useState("미정");
  const { userData } = useContext(UserContext);
  const size = 10;
  const nav = useNavigate();

  const fetchArticles = async () => {
    if (!userData || !userData.regionId) return;

    setLoading(true);
    try {
      const name = await fetchRegionName(userData.regionId);
      setRegionName(name);
      let url = `/api/v1/boards/region`;
      const params = {
        regionId: userData.regionId,
        size: size,
        page: currentPage,
      };

      if (completedOnly) {
        params.order = "incomplete";
      } else if (sortByTime) {
        params.order = "time";
      }

      if (word) {
        params.word = word;
      }

      const response = await axios.get(url, { params });
      const filteredArticles = response.data.data.filter(
        (article) => article.isDeleted !== 1
      );
      setArticles(filteredArticles);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && userData.regionId) {
      fetchArticles();
    }
  }, [userData, currentPage, sortByTime, completedOnly, word]);

  const handleSortByTime = () => {
    setSortByTime((prev) => !prev);
  };

  const handleCompletedOnly = () => {
    setCompletedOnly((prev) => !prev);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchArticles();
  };

  const handleCreateArticle = () => {
    nav("/article-create");
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>문제가 발생했습니다: {error.message}</p>;

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <Header
          onSearch={handleSearch}
          searchValue={word}
          setSearchValue={setWord}
        />
        <div className="ArticleHome">
          <div className="article-header">
            <h3
              style={{
                textAlign: "center",
                color: "black",
                fontSize: "28px",
                fontFamily: "VitroCore",
              }}
            >
              {regionName}
            </h3>

            <div className="article-filters">
              <div className="left-buttons">
                <button
                  onClick={handleCompletedOnly}
                  style={{
                    backgroundColor: "lightgray",
                    borderRadius: "20px",
                    color: "black",
                    border: "none",
                  }}
                >
                  {completedOnly ? "모든 글 보기" : "모집 가능한 글 보기"}
                </button>
                <button
                  onClick={handleSortByTime}
                  style={{
                    backgroundColor: "lightgray",
                    borderRadius: "20px",
                    color: "black",
                    border: "none",
                  }}
                >
                  {sortByTime ? "오래된순" : "최신순"}
                </button>
              </div>
            </div>
          </div>

          <ArticleList articles={articles} />
        </div>
        <div style={{ marginTop: "40px" }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        </div>
        <CreateArticleButton onClick={handleCreateArticle} />
      </div>
      <TabBar />
    </>
  );
};

export default ArticleHome;
