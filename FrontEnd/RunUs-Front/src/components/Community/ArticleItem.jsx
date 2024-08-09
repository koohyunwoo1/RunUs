import "../../styles/Community/ArticleItem.css";
import { useNavigate } from "react-router-dom";

const ArticleItem = ({ id, title, content }) => {
  const nav = useNavigate();

  // id가 홀수인지 짝수인지에 따라 클래스 이름을 설정
  const className = id % 2 === 0 ? "ArticleItem even" : "ArticleItem odd";

  return (
    <div className={className}>
      <div
        onClick={() => nav(`/article-detail/${id}`)}
        className="info-section"
      >
        <div className="article-title">{title}</div>
        <div className="created-date">{new Date().toLocaleDateString()}</div>
        <div className="article-content">{content}</div>
      </div>
    </div>
  );
};

export default ArticleItem;
