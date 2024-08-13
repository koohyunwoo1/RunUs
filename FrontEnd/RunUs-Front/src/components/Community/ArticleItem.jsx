import "../../styles/Community/ArticleItem.css";
import { useNavigate } from "react-router-dom";

const ArticleItem = ({ id, title, content, date }) => {
  const dateTimeArray = date.split('T');
  const formattedDate = dateTimeArray[0]; // "2024-08-15"
  const formattedTime = dateTimeArray[1].substring(0, 5); // "20:00"
  console.log(`${formattedDate} ${formattedTime}`); // "2024-08-15 20:00"

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
        <div className="created-date" style={{ fontFamily: "PreRegular", fontSize: "15px" }}>
          <span>
          {formattedDate}
          </span>
          <span style={{ marginLeft: "10px"}}>
          {formattedTime}
          </span>
        </div>
        <div className="article-content" style={{ fontFamily: "PreSemiBold" }}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default ArticleItem;
