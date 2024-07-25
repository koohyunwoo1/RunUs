import { useState } from "react"
import axios from "axios"
import "../../styles/Community/CommentSection.css"

const CommentSection = ({ comments, articleId }) => {
  const [ newComment, setNewComment ] = useState("")
  const [ commentList, setCommentList ] = useState(comments)

  const handleCommentChange = (e) => {
    setNewComment(e.target.value)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!(newComment).trim()) return

    try {
      const response = await axios.post(`/api/v1/boards/${articleId}/comments`, { content: newComment })
      setCommentList(prevComments => [...prevComments, response.data.data])
      setNewComment("")
    } catch (err) {
      console.error("댓글 작성 실패: ", err)
    }
  }

  return (
    <div className="comment-section">
      <h3>댓글</h3>
      <ul>
        {commentList.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요..."
        />
        <button type="submit">댓글 작성</button>
      </form>
    </div>
  );
}

export default CommentSection