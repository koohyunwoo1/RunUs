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
  const nav = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/boards'); // 실제 API 엔드포인트로 변경
        setData(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="ArticleList">
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
