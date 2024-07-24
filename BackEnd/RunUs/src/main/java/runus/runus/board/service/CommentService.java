package runus.runus.board.service;

import runus.runus.board.dto.CommentRequestDTO;
import runus.runus.board.dto.CommentResponseDTO;

import java.util.List;

public interface CommentService {
    void createComment(int boardId, CommentRequestDTO commentRequest);
    void updateComment(int boardId, int commentId, CommentRequestDTO commentRequest);
    void deleteComment(int boardId, int commentId);
    List<CommentResponseDTO> getComments(int boardId, int size, int page);
}
