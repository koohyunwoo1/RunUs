package runus.runus.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import runus.runus.board.dto.CommentRequestDTO;
import runus.runus.board.dto.CommentResponseDTO;
import runus.runus.board.entity.CommentEntity;
import runus.runus.board.repository.CommentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public void createComment(int boardId, CommentRequestDTO commentRequest) {
        CommentEntity comment = new CommentEntity();
        comment.setBoardId(boardId);
        comment.setContent(commentRequest.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUserId(commentRequest.getUserId());
        comment.setBoardId(commentRequest.getBoardId());
        comment.setParentId(commentRequest.getParentId());
        comment.setIsDeleted('N');
        commentRepository.save(comment);
    }

    @Override
    public void updateComment(int boardId, int commentId, CommentRequestDTO commentRequest) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(commentRequest.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    @Override
    public void deleteComment(int boardId, int commentId) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setIsDeleted('1'); // Assume '1' indicates deletion
        comment.setDeletedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    @Override
    public List<CommentResponseDTO> getComments(int boardId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        List<CommentEntity> comments = commentRepository.findByBoardId(boardId, pageable);
        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CommentResponseDTO convertToDTO(CommentEntity comment) {
        return new CommentResponseDTO(
                comment.getCommentId(), comment.getBoardId(), comment.getParentId(),
                comment.getUserId(), comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt());
    }
}
