// src/components/CommentSection.jsx
import React, { useState } from 'react';
import Button from '../common/Button';
import "../../styles/Community/CommentSection.css";

const CommentSection = ({ comments }) => {
  const [commentList, setCommentList] = useState(comments || []);
  const [newComment, setNewComment] = useState('');

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // 빈 댓글은 추가하지 않음

    const newCommentObj = {
      id: commentList.length + 1,
      author: '작성자', // 실제 작성자를 받아오는 로직으로 대체
      content: newComment,
      createdAt: new Date().toISOString()
    };

    setCommentList([...commentList, newCommentObj]);
    setNewComment('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>
      <ul>
        {commentList.length > 0 ? (
          commentList.map((comment) => (
            <li key={comment.id}>
              <div><strong>{comment.author}</strong></div>
              <div>{formatDate(comment.createdAt)}</div>
              <div>{comment.content}</div>
            </li>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </ul>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <div className="textarea-container">
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="댓글을 입력하세요"
          />
          <Button text="등록" className="comment-submit-button"/>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
