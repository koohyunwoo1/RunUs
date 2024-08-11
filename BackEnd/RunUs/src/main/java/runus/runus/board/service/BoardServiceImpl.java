package runus.runus.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import runus.runus.api.NotFoundElementException;
import runus.runus.board.dto.BoardRequestDTO;
import runus.runus.board.dto.BoardResponseDTO;
import runus.runus.board.entity.BoardEntity;
import runus.runus.board.repository.BoardRepository;
import runus.runus.board.repository.CommentRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Override
    public int createBoard(BoardRequestDTO boardRequest) {
        BoardEntity board = new BoardEntity();
        board.setTitle(boardRequest.getTitle());
        board.setContent(boardRequest.getContent());
        board.setRegionId(boardRequest.getRegionId());
        board.setCreatedAt(LocalDateTime.now());
        board.setMeetingTime(boardRequest.getMeetingTime());
        board.setMeetingDay(boardRequest.getMeetingDay());
        board.setUserId(boardRequest.getUserId());
        board.setIsDeleted('0');
        BoardEntity saveBoard = boardRepository.save(board);
        return saveBoard.getBoardId();
    }

    @Override
    public Page<BoardResponseDTO> getBoardsByRegion(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardResponseDTO> boards = boardRepository.findByRegionId(regionId, '0', pageable);
        return boards;
    }

    @Override
    public Page<BoardResponseDTO> getBoardsByTime(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardResponseDTO> boards = boardRepository.findUpcomingMeetings(regionId, '0', pageable);
        return boards;
    }

    @Override
    public Page<BoardResponseDTO> getIncompleteBoards(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardResponseDTO> boards = boardRepository.findIncompleteMeetings(regionId, '0', pageable);
        return boards;
    }

    @Override
    public Page<BoardResponseDTO> getIncompleteBoardsKeyword(int regionId, String word, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardResponseDTO> boards = boardRepository.findIncompleteMeetingsByKeyword(regionId, word, '0', pageable);
        return boards;
    }

    @Override
    public Page<BoardResponseDTO> getUpcomingBoardsKeyword(int regionId, String word, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardResponseDTO> boards = boardRepository.findUpcomingMeetingsByKeyword(regionId, word, '0', pageable);
        return boards;
    }

    @Override
    public Page<BoardResponseDTO> searchBoards(int regionId, String word, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardResponseDTO> boards = boardRepository.findByRegionIdByKeyword(regionId, word, '0', pageable);
        return boards;
    }

    @Override
    public void updateBoard(int boardId, BoardRequestDTO boardRequest) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFoundElementException("Board not found"));

        if (board.getIsDeleted() == '1') {
            throw new NotFoundElementException("Cannot update a deleted board");
        }
        if (boardRequest.getTitle() != null) {
            board.setTitle(boardRequest.getTitle());
        }
        if (boardRequest.getContent() != null) {
            board.setContent(boardRequest.getContent());
        }
        if (boardRequest.getRegionId() != null) {
            board.setRegionId(boardRequest.getRegionId());
        }
        if (boardRequest.getMeetingTime() != null) {
            board.setMeetingTime(boardRequest.getMeetingTime());
        }
        if (boardRequest.getMeetingDay() != null) {
            board.setMeetingDay(boardRequest.getMeetingDay());
        }

        board.setUpdatedAt(LocalDateTime.now());

        boardRepository.save(board);
    }

    @Override
    public BoardResponseDTO getBoardDetails(int boardId) {
        Optional<BoardResponseDTO> optionalBoard = Optional.ofNullable(boardRepository.findByIdDetail(boardId));
        BoardResponseDTO board = optionalBoard.orElseThrow(() -> new NotFoundElementException("Not Found"));
        if (board.getIsDeleted() == '1') {
            throw new NotFoundElementException("Board has been deleted");
        }
        return board;
    }

    @Override
    public void deleteBoard(int boardId) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFoundElementException("Board not found"));
        board.setIsDeleted('1');
        board.setDeletedAt(LocalDateTime.now());
        boardRepository.save(board);
    }
}
