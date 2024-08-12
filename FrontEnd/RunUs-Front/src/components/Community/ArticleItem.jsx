import "../../styles/Community/ArticleItem.css";
import { useNavigate } from "react-router-dom";

const ArticleItem = ({ id, title, content }) => {
  const nav = useNavigate();
  return (
    <div>
      <div
        onClick={() => nav(`/article-detail/${id}`)}
        className="info-section"
      >
        <div className="article-title" style={{ fontFamily: "PreBold" }}>
          {title}
        </div>
        <div className="created-date" style={{ fontFamily: "PreRegular" }}>
          {new Date().toLocaleDateString()}
        </div>
        <div className="article-content" style={{ fontFamily: "PreSemiBold" }}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default ArticleItem;
