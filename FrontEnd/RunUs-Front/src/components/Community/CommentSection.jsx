import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../styles/Community/CommentSection.css";
import { UserContext } from "../../hooks/UserContext";

const CommentSection = ({ articleId }) => {
  const { userData } = useContext(UserContext);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [dropdownCommentId, setDropdownCommentId] = useState(null);

  const fetchComments = async (pageNumber = 0) => {
    try {
      const response = await axios.get(`/api/v1/boards/comments`, {
        params: { boardId: articleId, size, page: pageNumber }
      });
      if (response.data && response.data.data) {
        if (response.data.data.length < size) {
          setHasMoreComments(false);
        }
        setCommentList((prevComments) => {
          const newComments = [...prevComments, ...response.data.data];
          const uniqueComments = Array.from(new Set(newComments.map(comment => comment.commentId)))
              .map(id => {
                return newComments.find(comment => comment.commentId === id);
              });
          return uniqueComments;
        });
      } else {
        console.error("댓글 데이터가 없습니다.");
      }
    } catch (err) {
      console.error("댓글 로드 실패: ", err);
    }
  };

  useEffect(() => {
    fetchComments(page);
  }, [articleId, page]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(`/api/v1/boards/comments`, {
        content: newComment,
        userId: userData.userId,
        boardId: articleId,
        parentId: replyingTo
      });
      setNewComment("");
      setReplyingTo(null);
      setPage(0);
      setCommentList([]);
      await fetchComments();
    } catch (err) {
      console.error("댓글 작성 실패: ", err);
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
    setDropdownCommentId(null);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await axios.put(`/api/v1/boards/comments`, {
        commentId,
        content: editingContent,
      });
      setEditingCommentId(null);
      setEditingContent("");
      setPage(0);
      setCommentList([]);
      await fetchComments();
    } catch (err) {
      console.error("댓글 수정 실패: ", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/v1/boards/comments`,{
       data: { commentId },
      });
      setPage(0);
      setCommentList([]);
      await fetchComments();
    } catch (err) {
      console.error("댓글 삭제 실패: ", err);
    }
  };

  const loadMoreComments = () => {
    if (hasMoreComments) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleReply = (commentId, e) => {
    e.stopPropagation();
    setReplyingTo(commentId);
    setDropdownCommentId(null);
  };

  const toggleDropdown = (commentId) => {
    setDropdownCommentId((prevId) => (prevId === commentId ? null : commentId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "미정";

    try {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      };
      return new Date(dateString).toLocaleString(undefined, options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return "형식 오류";
    }
  };

  const renderComments = (comments, parentId = null, level = 0) => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <div key={comment.commentId} className={level > 0 ? "nested-comment" : ""}>
          {editingCommentId === comment.commentId ? (
            <div className="comment-container">
              <textarea
                className="comment-writer"
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
              />
              <button
                className="create-comment"
                onClick={() => handleUpdateComment(comment.commentId)}
              >
                수정 완료
              </button>
            </div>
          ) : (
            <div className="comment-container">
              <div>
                <p><strong>{comment.nickname}</strong> <span className="date">{formatDate(comment.createdAt)}</span></p>
                <p>{comment.content}</p>
              </div>
              {userData.userId === comment.userId && (
                <>
                  <button
                    className="menu-button"
                    onClick={() => toggleDropdown(comment.commentId)}
                  >
                    ⋮
                  </button>
                  <div className={`comment-options ${dropdownCommentId === comment.commentId ? 'show' : ''}`}>
                    <button onClick={() => handleEditComment(comment.commentId, comment.content)}>
                      수정
                    </button>
                    <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                  </div>
                </>
              )}
              <button onClick={(e) => handleReply(comment.commentId, e)} className="reply-button">답글</button>
            </div>
          )}
          {renderComments(comments, comment.commentId, level + 1)}
        </div>
      ));
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>
      <ul className="comment-list-ul">
        {renderComments(commentList)}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <div className="textarea-container">
          <textarea
            className="comment-writer"
            value={newComment}
            onChange={handleCommentChange}
            placeholder={replyingTo ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
          />
          <div className="submit-container">
            <button type="submit" className="create-comment">
              {replyingTo ? "답글" : "댓글"}
            </button>
            {replyingTo && (
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="cancel-reply"
              >
                취소
              </button>
            )}
          </div>
        </div>
      </form>
      {hasMoreComments && (
        <button onClick={loadMoreComments}>더 보기</button>
      )}
    </div>
  );
};

export default CommentSection;
