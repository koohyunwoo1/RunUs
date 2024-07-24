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

  const fetchArticles = async (regionId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/region/${regionId}`)
      setData(response.data)
    } catch (error) {
      console.error('Error fetching articles: ', error)
    }
  }

  useEffect(() => {
    const regionId = regionFilter || 1 // 기본값을 설정 또는 다른 논리로 기본값 설정 가능
    fetchArticles(regionId)
  }, [regionFilter])

  // 필터링 및 정렬 로직
  let filteredData = data.filter(item => {
    return (!completedOnly || item.completed) &&
      item.title.toLowerCase().includes(query.toLowerCase())
  })

  if (sortByTime) {
    filteredData = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return (
    <div>
      <Header />
      <div className="ArticleList">
        <div className="article-filters">
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
          <Button
            className="article-create-button"
            text={"글 쓰기"} 
            onClick={() => nav('/article-create')} />
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
