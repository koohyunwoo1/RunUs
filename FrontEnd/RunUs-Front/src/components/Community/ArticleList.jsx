// src/components/Community/ArticleList.jsx
import "../../styles/Community/ArticleList.css";
import Button from "../../components/common/Button";
import ArticleItem from "../../components/Community/ArticleItem";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Search from "./Search";
import axios from 'axios';

const ArticleList = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [completedOnly, setCompletedOnly] = useState(false);
  const [sortByTime, setSortByTime] = useState(false);
  const [regionFilter, setRegionFilter] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/region/${region-id}`); // 실제 API 엔드포인트로 변경
        setData(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  // 필터링 및 정렬 로직
  let filteredData = data.filter(item => {
    return (!completedOnly || item.completed) && 
           (!regionFilter || item.region === regionFilter) &&
           item.title.toLowerCase().includes(query.toLowerCase());
  });

  if (sortByTime) {
    filteredData = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (
    <div>
      <Header />
      <div className="ArticleList">
        <div className="filters">
          <Button 
            text={completedOnly ? "모든 글 보기" : "모집 완료된 글만 보기"} 
            onClick={() => setCompletedOnly(!completedOnly)}
          />
          <Button 
            text={sortByTime ? "시간순" : "최신순"} 
            onClick={() => setSortByTime(!sortByTime)}
          />
        </div>
        <div className="article-wrapper">
          <Search query={query} onQueryChange={setQuery} />
          <ul>
            {filteredData.length > 0 ? (
              filteredData.map(post => (
                <ArticleItem key={post.id} {...post} />
              ))
            ) : (
              <p>No posts found</p>
            )}
          </ul>
          <Button text={"글 쓰기"} onClick={() => nav('/article-create')} />
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
