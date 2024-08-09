package runus.runus.board.service;

import org.springframework.data.domain.Page;
import runus.runus.board.dto.BoardRequestDTO;
import runus.runus.board.dto.BoardResponseDTO;

public interface BoardService {
    int createBoard(BoardRequestDTO boardRequest);
    Page<BoardResponseDTO> getBoardsByRegion(int regionId, int size, int page);
    Page<BoardResponseDTO> getBoardsByTime(int regionId, int size, int page);
    Page<BoardResponseDTO> getIncompleteBoards(int regionId, int size, int page);
    Page<BoardResponseDTO> getUpcomingBoardsKeyword(int regionId, String word, int size, int page);
    Page<BoardResponseDTO> getIncompleteBoardsKeyword(int regionId, String word, int size, int page);
    Page<BoardResponseDTO> searchBoards(int regionId, String word, int size, int page);
    void updateBoard(int boardId, BoardRequestDTO boardRequest);
    BoardResponseDTO getBoardDetails(int boardId);
    void deleteBoard(int boardId);
}
