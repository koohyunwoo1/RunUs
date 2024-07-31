import React from "react";
import "../../styles/Community/ArticleList.css";
import Button from "../common/Button";
import ArticleItem from "./ArticleItem";
import { useNavigate } from "react-router-dom";

const ArticleList = ({ articles }) => {
  const nav = useNavigate();

  return (
    <div className="ArticleList">
      <div className="article-wrapper">
        <ul>
          {articles.length > 0 ? (
            articles.map(post => (
              <ArticleItem
                key={post.boardId}
                id={post.boardId} // 이 부분 확인
                title={post.title}
                content={post.content}
              />
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
  );
};

export default ArticleList;
