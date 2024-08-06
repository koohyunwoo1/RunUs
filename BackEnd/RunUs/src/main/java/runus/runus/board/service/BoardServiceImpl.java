package runus.runus.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import runus.runus.api.NotFoundException;
import runus.runus.board.dto.BoardRequestDTO;
import runus.runus.board.dto.BoardResponseDTO;
import runus.runus.board.dto.CommentRequestDTO;
import runus.runus.board.dto.CommentResponseDTO;
import runus.runus.board.entity.BoardEntity;
import runus.runus.board.entity.CommentEntity;
import runus.runus.board.repository.BoardRepository;
import runus.runus.board.repository.CommentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private CommentRepository commentRepository;

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
    public Page<BoardEntity> getBoardsByRegion(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardEntity> boards = boardRepository.findByRegionIdAndIsDeletedWithNickname(regionId, '0', pageable);
        return boards;
    }

    @Override
    public Page<BoardEntity> getBoardsByTime(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardEntity> boards = boardRepository.findUpcomingMeetings(regionId, '0', pageable);
        return boards;
    }

    @Override
    public Page<BoardEntity> getIncompleteBoards(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardEntity> boards = boardRepository.findUpcomingMeetings(regionId, '0', pageable);
        return boards;
    }

    @Override
    public List<BoardResponseDTO> getIncompleteBoardsKeyword(int regionId, String word, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardEntity> boards = boardRepository.findByRegionIdAndTitleContainingAndIsDeleted(regionId, word, '0', pageable);
        return boards.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<BoardResponseDTO> searchBoards(int regionId, String word, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardEntity> boards = boardRepository.findByRegionIdAndTitleContainingAndIsDeleted(regionId, word, '0', pageable);
        return boards.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public void updateBoard(int boardId, BoardRequestDTO boardRequest) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFoundException("Board not found"));
        if (board.getIsDeleted() == '1') {
            throw new NotFoundException("Cannot update a deleted board");
        }
        board.setTitle(boardRequest.getTitle());
        board.setContent(boardRequest.getContent());
        board.setRegionId(boardRequest.getRegionId());
        board.setUpdatedAt(LocalDateTime.now());
        board.setMeetingTime(boardRequest.getMeetingTime());
        board.setMeetingDay(boardRequest.getMeetingDay());
        board.setUserId(boardRequest.getUserId());
        boardRepository.save(board);
    }

    @Override
    public BoardResponseDTO getBoardDetails(int boardId) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFoundException("Board not found"));
        if (board.getIsDeleted() == '1') {
            throw new NotFoundException("Board has been deleted");
        }
        return convertToDTO(board);
    }

    @Override
    public void deleteBoard(int boardId) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new NotFoundException("Board not found"));
        board.setIsDeleted('1');
        board.setDeletedAt(LocalDateTime.now());
        boardRepository.save(board);
    }

    @Override
    public BoardResponseDTO convertToDTO(BoardEntity board) {
        return new BoardResponseDTO(
                board.getBoardId(), board.getTitle(), board.getContent(),
                board.getCreatedAt(), board.getUpdatedAt(),
                board.getRegionId(), board.getMeetingTime(), board.getMeetingDay(), board.getNickname());
    }

    @Override
    public CommentResponseDTO convertToDTO(CommentEntity comment) {
        return new CommentResponseDTO(
                comment.getCommentId(), comment.getBoardId(), comment.getParentId(),
                comment.getUserId(), comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt(),
                comment.getNickname());
    }
}
