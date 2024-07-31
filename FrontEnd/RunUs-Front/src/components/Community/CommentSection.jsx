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

  // 댓글 목록을 가져오는 함수
  const fetchComments = async (pageNumber = 0) => {
    try {
      const response = await axios.get(`/api/v1/boards/${articleId}/comments`, {
        params: { size, page: pageNumber }
      });
      if (response.data && response.data.data) {
        if (response.data.data.length < size) {
          setHasMoreComments(false);
        }
        setCommentList((prevComments) => {
          // 댓글 중복 제거
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
      await axios.post(`/api/v1/boards/${articleId}/comments`, {
        content: newComment,
        userId: userData.userId,
        nickname: userData.nickname
      });
      setNewComment("");
      setPage(0); // 댓글 작성 후 페이지 초기화
      setCommentList([]); // 댓글 작성 후 목록을 초기화하여 재로딩
      await fetchComments(); // 작성 후 최신 댓글 목록을 가져옵니다.
    } catch (err) {
      console.error("댓글 작성 실패: ", err);
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await axios.put(`/api/v1/boards/${articleId}/comments/${commentId}`, {
        content: editingContent,
        userId: userData.userId
      });
      setEditingCommentId(null);
      setEditingContent("");
      setPage(0); // 댓글 수정 후 페이지 초기화
      setCommentList([]); // 댓글 수정 후 목록을 초기화하여 재로딩
      await fetchComments(); // 수정 후 최신 댓글 목록을 가져옵니다.
    } catch (err) {
      console.error("댓글 수정 실패: ", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/v1/boards/${articleId}/comments/${commentId}`);
      setPage(0); // 댓글 삭제 후 페이지 초기화
      setCommentList([]); // 댓글 삭제 후 목록을 초기화하여 재로딩
      await fetchComments(); // 삭제 후 최신 댓글 목록을 가져옵니다.
    } catch (err) {
      console.error("댓글 삭제 실패: ", err);
    }
  };

  const loadMoreComments = () => {
    if (hasMoreComments) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>
      <ul>
        {commentList.map((comment) => {
          return (
            <li key={comment.commentId}>
              {editingCommentId === comment.commentId ? (
                <div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button onClick={() => handleUpdateComment(comment.commentId)}>수정 완료</button>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>{comment.nickname}</strong> : {comment.content}
                  </p>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  {userData.userId === comment.userId && (
                    <div>
                      <button onClick={() => handleEditComment(comment.commentId, comment.content)}>수정</button>
                      <button onClick={() => handleDeleteComment(comment.commentId)}>삭제</button>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="댓글을 입력하세요..."
        />
        <button type="submit">댓글 작성</button>
      </form>
      {hasMoreComments && (
        <button onClick={loadMoreComments}>더 보기</button>
      )}
    </div>
  );
  
};

export default CommentSection;
