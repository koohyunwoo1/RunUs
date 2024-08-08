package runus.runus.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import runus.runus.api.NotFoundException;
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
    public void createComment(CommentRequestDTO commentRequest) {
        CommentEntity comment = new CommentEntity();
        comment.setBoardId(commentRequest.getBoardId());
        comment.setContent(commentRequest.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUserId(commentRequest.getUserId());
        comment.setParentId(commentRequest.getParentId());
        comment.setIsDeleted('0');
        commentRepository.save(comment);
    }

    @Override
    public void updateComment(CommentRequestDTO commentRequest) {
        CommentEntity comment = commentRepository.findById(commentRequest.getCommentId())
                .orElseThrow(() -> new NotFoundException("Comment not found"));
        if (comment.getIsDeleted() == '1') {
            throw new NotFoundException("Cannot update a deleted comment");
        }
        comment.setContent(commentRequest.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    @Override
    public void deleteComment(CommentRequestDTO commentRequest) {
        CommentEntity comment = commentRepository.findById(commentRequest.getCommentId())
                .orElseThrow(() -> new NotFoundException("Comment not found"));
        comment.setIsDeleted('1');
        comment.setDeletedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    @Override
    public Page<CommentResponseDTO> getComments(int boardId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<CommentResponseDTO> comments = commentRepository.findBoardComents(boardId, '0', pageable);
        return comments;
    }

    private CommentResponseDTO convertToDTO(CommentEntity comment) {
        return new CommentResponseDTO(
                comment.getCommentId(), comment.getBoardId(), comment.getParentId(),
                comment.getUserId(), comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt(),
                comment.getNickname());
    }
}
