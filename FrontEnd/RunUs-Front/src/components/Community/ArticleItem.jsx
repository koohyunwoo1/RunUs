import "../../styles/Community/ArticleItem.css"
import Button from "../common/Button"
import { useNavigate } from "react-router-dom";

const ArticleItem = ({id, title, content }) => {

  const nav = useNavigate()

  return (
    <div className="ArticleItem">
      <div
        onClick={()=>nav(`/article-home/${id}`)}  
        className="info-section">
        <div className="article-title">
          {title}
        </div>
        <div className="created-date">
          {new Date().toLocaleDateString()}
        </div>
        <div className="article-content">{content}</div>
      </div>
      {/* <div className="button-section">
        <Button
          onClick={()=>nav(`/article-home/${id}`)}  
          text={"수정하기"} 
        />
      </div> */}
    </div>
  );
};

export default ArticleItem;
