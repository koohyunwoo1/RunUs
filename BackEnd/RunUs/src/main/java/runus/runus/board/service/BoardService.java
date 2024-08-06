package runus.runus.board.service;

import org.springframework.data.domain.Page;
import runus.runus.board.dto.BoardRequestDTO;
import runus.runus.board.dto.BoardResponseDTO;
import runus.runus.board.dto.CommentRequestDTO;
import runus.runus.board.dto.CommentResponseDTO;
import runus.runus.board.entity.BoardEntity;
import runus.runus.board.entity.CommentEntity;

import java.util.List;

public interface BoardService {
    int createBoard(BoardRequestDTO boardRequest);
    Page<BoardEntity> getBoardsByRegion(int regionId, int size, int page);
    Page<BoardEntity> getBoardsByTime(int regionId, int size, int page);
    Page<BoardEntity> getIncompleteBoards(int regionId, int size, int page);
    List<BoardResponseDTO> getIncompleteBoardsKeyword(int regionId, String word, int size, int page);
    List<BoardResponseDTO> searchBoards(int regionId, String word, int size, int page);
    void updateBoard(int boardId, BoardRequestDTO boardRequest);
    BoardResponseDTO getBoardDetails(int boardId);
    void deleteBoard(int boardId);

    BoardResponseDTO convertToDTO(BoardEntity board);
    CommentResponseDTO convertToDTO(CommentEntity comment);
}
