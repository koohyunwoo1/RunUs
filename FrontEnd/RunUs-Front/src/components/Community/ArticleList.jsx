import React from "react";
import "../../styles/Community/ArticleList.css";
import Button from "../../components/common/Button";
import ArticleItem from "../../components/Community/ArticleItem";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Search from "./Search";

const ArticleList = ({ articles }) => {
  const nav = useNavigate();

  return (
    <div>
      <Header />
      <div className="ArticleList">
        <div className="article-wrapper">
          <ul>
            {articles.length > 0 ? (
              articles.map(post => (
                <ArticleItem key={post.id} {...post} />
              ))
            ) : (
              <p>게시글이 없습니다.</p>
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
