package runus.runus.board.service;

import runus.runus.board.dto.BoardRequestDTO;
import runus.runus.board.dto.BoardResponseDTO;

import java.util.List;

public interface BoardService {
    void createBoard(BoardRequestDTO boardRequest);

    List<BoardResponseDTO> getBoardsByRegion(int regionId, int size, int page);

    List<BoardResponseDTO> getBoardsByTime(int regionId, int size, int page);

    List<BoardResponseDTO> getIncompleteBoards(int regionId, int size, int page);

    List<BoardResponseDTO> searchBoards(int regionId, String word, int size, int page);

    void updateBoard(int boardId, BoardRequestDTO boardRequest);

    BoardResponseDTO getBoardDetails(int boardId);

    void deleteBoard(int boardId);
}
