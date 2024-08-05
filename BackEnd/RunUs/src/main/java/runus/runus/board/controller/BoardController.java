package runus.runus.board.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.board.dto.BoardRequestDTO;
import runus.runus.board.dto.BoardResponseDTO;
import runus.runus.board.service.BoardService;
import runus.runus.api.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<ApiResponse<Integer>> createBoard(@RequestBody BoardRequestDTO boardRequest) {
        System.out.println(boardRequest);
        try {
            int boardId = boardService.createBoard(boardRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, boardId, "글 작성 성공"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, null, "글 작성 실패: " + e.getMessage()));
        }
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<ApiResponse<List<BoardResponseDTO>>> getBoardsByRegion(
            @PathVariable("regionId") int regionId,
            @RequestParam int size,
            @RequestParam int page) {
        try {
            List<BoardResponseDTO> boards = boardService.getBoardsByRegion(regionId, size, page);
            return ResponseEntity.ok(new ApiResponse<>(true, boards, "성공"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, null, "조회 실패: " + e.getMessage()));
        }
    }

    @GetMapping("/region/{regionId}/time")
    public ResponseEntity<ApiResponse<List<BoardResponseDTO>>> getBoardsByTime(
            @PathVariable("regionId") int regionId,
            @RequestParam int size,
            @RequestParam int page) {
        try {
            List<BoardResponseDTO> boards = boardService.getBoardsByTime(regionId, size, page);
            return ResponseEntity.ok(new ApiResponse<>(true, boards, "성공"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, null, "조회 실패: " + e.getMessage()));
        }
    }

    @GetMapping("/region/{regionId}/incomplete")
    public ResponseEntity<ApiResponse<List<BoardResponseDTO>>> getIncompleteBoards(
            @PathVariable("regionId") int regionId,
            @RequestParam int size,
            @RequestParam int page) {
        try {
            List<BoardResponseDTO> boards = boardService.getIncompleteBoards(regionId, size, page);
            return ResponseEntity.ok(new ApiResponse<>(true, boards, "성공"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, null, "조회 실패: " + e.getMessage()));
        }
    }

    @GetMapping("/region/{regionId}/{word}")
    public ResponseEntity<ApiResponse<List<BoardResponseDTO>>> searchBoards(
            @PathVariable("regionId") int regionId,
            @PathVariable("word") String word,
            @RequestParam int size,
            @RequestParam int page) {
        try {
            List<BoardResponseDTO> boards = boardService.searchBoards(regionId, word, size, page);
            return ResponseEntity.ok(new ApiResponse<>(true, boards, "성공"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, null, "조회 실패: " + e.getMessage()));
        }
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<ApiResponse<Void>> updateBoard(
            @PathVariable("boardId") int boardId,
            @RequestBody BoardRequestDTO boardRequest) {
        try {
            boardService.updateBoard(boardId, boardRequest);
            return ResponseEntity.ok(new ApiResponse<>(true, null, "글 수정 성공"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, null, "글 수정 실패: " + e.getMessage()));
        }
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<ApiResponse<BoardResponseDTO>> getBoardDetails(@PathVariable("boardId") int boardId) {
        try {
            BoardResponseDTO board = boardService.getBoardDetails(boardId);
            return ResponseEntity.ok(new ApiResponse<>(true, board, "성공"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, null, "조회 실패: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<ApiResponse<Void>> deleteBoard(@PathVariable("boardId") int boardId) {
        try {
            boardService.deleteBoard(boardId);
            return ResponseEntity.ok(new ApiResponse<>(true, null, "글 삭제 성공"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, null, "글 삭제 실패: " + e.getMessage()));
        }
    }
}
