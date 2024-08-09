import React from "react";
import "../../styles/Community/ArticleList.css";
import Button from "../common/Button";
import ArticleItem from "./ArticleItem";

const ArticleList = ({ articles }) => {
  

  return (
    
    <div className="ArticleList">
      <div className="article-wrapper">
        <ul>
          {articles.length > 0 ? (
            articles.map(post => (
              <ArticleItem
                key={post.boardId}
                id={post.boardId}
                title={post.title}
                content={post.content}
                className={`ArticleItem ${post.boardId % 2 === 0 ? 'even' : 'odd'}`} // 클래스 이름 조건부 설정
              />
            ))
          ) : (
            <p>게시글이 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ArticleList;
