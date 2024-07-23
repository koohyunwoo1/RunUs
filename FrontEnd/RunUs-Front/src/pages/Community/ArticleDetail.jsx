import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Community/ArticleDetail.css"
import CommentSection from "../../components/Community/CommentSection";
import Button from "../../components/common/Button";

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric'}
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const ArticleDetail = () => {
  const { id } = useParams()
  const nav = useNavigate()
  const [ article, setArticle ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState(null)
  const [ comments, setComments ] = useState([])

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const reponse = await axios.get(`http://localhost:8080/api/v1/boards/${id}`)
        setArticle(reponse.data.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  if (!article) return <p>로딩 중...</p>
  if (error) return <p>문제가 발생했습니다: {error.message}</p>;
  if (!article) return <p>글을 찾을 수 없습니다.</p>;

  return (
    <div className="article-detail-container">
      <h1>{article.title}</h1>
      <p><strong>작성 시간:</strong> {formatDate(article.createdAt)}</p>
      <p><strong>출발 시간:</strong> {article.meetingTime || "미정"}</p>
      <p><strong>사는 지역:</strong> {article.region}</p>
      <p><strong>작성자:</strong> {article.nickname || "익명"}</p>
      <div className="article-content">
        {article.content}
      </div>
      <CommentSection comments={comments} />
      <Button text="목록" onClick={() => nav('/article-home')} />
    </div>
  )
};

export default ArticleDetail;
