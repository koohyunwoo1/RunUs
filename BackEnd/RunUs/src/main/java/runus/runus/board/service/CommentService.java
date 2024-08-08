package runus.runus.board.service;

import org.springframework.data.domain.Page;
import runus.runus.board.dto.CommentRequestDTO;
import runus.runus.board.dto.CommentResponseDTO;

import java.util.List;

public interface CommentService {
    void createComment(CommentRequestDTO commentRequest);
    void updateComment(CommentRequestDTO commentRequest);
    void deleteComment(CommentRequestDTO commentRequest);
    Page<CommentResponseDTO> getComments(int boardId, int size, int page);
}
