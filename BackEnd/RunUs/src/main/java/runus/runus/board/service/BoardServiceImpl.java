package runus.runus.board.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import runus.runus.board.dto.BoardRequestDTO;
import runus.runus.board.dto.BoardResponseDTO;
import runus.runus.board.entity.BoardEntity;
import runus.runus.board.repository.BoardRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Override
    public void createBoard(BoardRequestDTO boardRequest) {
        BoardEntity boardEntity = new BoardEntity();
        boardEntity.setTitle(boardRequest.getTitle());
        boardEntity.setContent(boardRequest.getContent());
        boardEntity.setRegionId(boardRequest.getRegionId());
        boardEntity.setCreatedAt(LocalDateTime.now());
        boardEntity.setUpdatedAt(LocalDateTime.now());
        boardEntity.setIsDeleted("0");
        boardRepository.save(boardEntity);
    }

    @Override
    public List<BoardResponseDTO> getBoardsByRegion(int regionId, int size, int page) {
        List<BoardEntity> boards = boardRepository.findByRegionId(regionId);
        return boards.stream().map(board -> {
            BoardResponseDTO dto = new BoardResponseDTO();
            dto.setTitle(board.getTitle());
            dto.setContent(board.getContent());
//            dto.setNickname(board.getUser().getNickname()); // 예시: User 엔티티에서 닉네임 가져오기
            dto.setCreatedAt(board.getCreatedAt().toString());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<BoardResponseDTO> getBoardsByTime(int regionId, int size, int page) {
        List<BoardEntity> boards = boardRepository.findByRegionIdOrderByCreatedAtDesc(regionId);
        return boards.stream().map(board -> {
            BoardResponseDTO dto = new BoardResponseDTO();
            dto.setTitle(board.getTitle());
            dto.setContent(board.getContent());
//            dto.setNickname(board.getUser().getNickname()); // 예시: User 엔티티에서 닉네임 가져오기
            dto.setCreatedAt(board.getCreatedAt().toString());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<BoardResponseDTO> getIncompleteBoards(int regionId, int size, int page) {
        List<BoardEntity> boards = boardRepository.findByRegionIdAndIncomplete(regionId);
        return boards.stream().map(board -> {
            BoardResponseDTO dto = new BoardResponseDTO();
            dto.setTitle(board.getTitle());
            dto.setContent(board.getContent());
//            dto.setNickname(board.getUser().getNickname()); // 예시: User 엔티티에서 닉네임 가져오기
            dto.setCreatedAt(board.getCreatedAt().toString());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<BoardResponseDTO> searchBoards(int regionId, String word, int size, int page) {
        List<BoardEntity> boards = boardRepository.searchByKeyword(regionId, word);
        return boards.stream().map(board -> {
            BoardResponseDTO dto = new BoardResponseDTO();
            dto.setTitle(board.getTitle());
            dto.setContent(board.getContent());
//            dto.setNickname(board.getUser().getNickname()); // 예시: User 엔티티에서 닉네임 가져오기
            dto.setCreatedAt(board.getCreatedAt().toString());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void updateBoard(int boardId, BoardRequestDTO boardRequest) {
        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        boardEntity.setTitle(boardRequest.getTitle());
        boardEntity.setContent(boardRequest.getContent());
        boardEntity.setRegionId(boardRequest.getRegionId());
        boardEntity.setUpdatedAt(LocalDateTime.now());
        boardRepository.save(boardEntity);
    }

    @Override
    public BoardResponseDTO getBoardDetails(int boardId) {
        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        BoardResponseDTO dto = new BoardResponseDTO();
        dto.setTitle(boardEntity.getTitle());
        dto.setContent(boardEntity.getContent());
//        dto.setNickname(boardEntity.getUser().getNickname()); // 예시: User 엔티티에서 닉네임 가져오기
        dto.setCreatedAt(boardEntity.getCreatedAt().toString());
        return dto;
    }

    @Override
    public void deleteBoard(int boardId) {
        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        boardEntity.setIsDeleted("1");
        boardEntity.setDeletedAt(LocalDateTime.now());
        boardRepository.save(boardEntity);
    }
}
