package runus.runus.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
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
    public void createBoard(BoardRequestDTO boardRequest) {
        BoardEntity board = new BoardEntity();
        board.setTitle(boardRequest.getTitle());
        board.setContent(boardRequest.getContent());
        board.setRegionId(boardRequest.getRegionId());
        board.setCreatedAt(LocalDateTime.now());
        board.setMeetingTime(boardRequest.getMeetingTime());  // 새로운 필드 추가
        board.setMeetingDay(boardRequest.getMeetingDay());    // 새로운 필드 추가
        board.setUserId(boardRequest.getUserId());
        board.setIsDeleted('N');
        boardRepository.save(board);
    }

    @Override
    public List<BoardResponseDTO> getBoardsByRegion(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        List<BoardEntity> boards = boardRepository.findByRegionId(regionId, pageable);
        return boards.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<BoardResponseDTO> getBoardsByTime(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        List<BoardEntity> boards = boardRepository.findByRegionIdOrderByCreatedAtAsc(regionId, pageable);
        return boards.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<BoardResponseDTO> getIncompleteBoards(int regionId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        List<BoardEntity> boards = boardRepository.findByRegionIdAndIsDeleted(regionId, '0', pageable);
        return boards.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<BoardResponseDTO> searchBoards(int regionId, String word, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        List<BoardEntity> boards = boardRepository.findByRegionIdAndTitleContaining(regionId, word, pageable);
        return boards.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public void updateBoard(int boardId, BoardRequestDTO boardRequest) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        board.setTitle(boardRequest.getTitle());
        board.setContent(boardRequest.getContent());
        board.setRegionId(boardRequest.getRegionId());
        board.setUpdatedAt(LocalDateTime.now());
        board.setMeetingTime(boardRequest.getMeetingTime());  // 새로운 필드 추가
        board.setMeetingDay(boardRequest.getMeetingDay());    // 새로운 필드 추가
        board.setUserId(boardRequest.getUserId());
        boardRepository.save(board);
    }

    @Override
    public BoardResponseDTO getBoardDetails(int boardId) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        return convertToDTO(board);
    }

    @Override
    public void deleteBoard(int boardId) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        board.setIsDeleted('1');
        board.setDeletedAt(LocalDateTime.now());
        boardRepository.save(board);
    }

    @Override
    public void createComment(int boardId, CommentRequestDTO commentRequest) {
        CommentEntity comment = new CommentEntity();
        comment.setBoardId(boardId);
        comment.setContent(commentRequest.getContent());
        comment.setCreatedAt(LocalDateTime.now());
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
        comment.setIsDeleted('1');
        comment.setDeletedAt(LocalDateTime.now());
        commentRepository.save(comment);
    }

    @Override
    public List<CommentResponseDTO> getComments(int boardId, int size, int page) {
        Pageable pageable = PageRequest.of(page, size);
        List<CommentEntity> comments = commentRepository.findByBoardId(boardId, pageable);
        return comments.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private BoardResponseDTO convertToDTO(BoardEntity board) {
        return new BoardResponseDTO(
                board.getBoardId(), board.getTitle(), board.getContent(),
                board.getNickname(), board.getCreatedAt(), board.getUpdatedAt(),
                board.getRegionId(), board.getMeetingTime(), board.getMeetingDay());
    }

    private CommentResponseDTO convertToDTO(CommentEntity comment) {
        return new CommentResponseDTO(
                comment.getCommentId(), comment.getBoardId(), comment.getParentId(),
                comment.getUserId(), comment.getContent(), comment.getCreatedAt(), comment.getUpdatedAt());
    }

}
