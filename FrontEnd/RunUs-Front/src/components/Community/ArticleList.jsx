import React from "react";
import "../../styles/Community/ArticleList.css";
import Button from "../common/Button";
import ArticleItem from "./ArticleItem";

const ArticleList = ({ articles }) => {
  console.log(articles)
  return (
    <div className="ArticleList">
      <div className="article-wrapper">
        <ul>
          {articles.length > 0
            ? articles.map((post) => (
                <ArticleItem
                  key={post.boardId}
                  id={post.boardId}
                  title={post.title}
                  content={post.content}
                  date={post.meetingTime}
                  className={`ArticleItem ${
                    post.boardId % 2 === 0 ? "even" : "odd"
                  }`} // 클래스 이름 조건부 설정
                />
              ))
            : null}
        </ul>
      </div>
    </div>
  );
};

export default ArticleList;
