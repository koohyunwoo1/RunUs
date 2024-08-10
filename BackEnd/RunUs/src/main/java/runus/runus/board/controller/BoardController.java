package runus.runus.board.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.api.ApiResponse;
import runus.runus.board.common.ApiBoardResponse;
import runus.runus.board.dto.BoardRequestDTO;
import runus.runus.board.dto.BoardResponseDTO;
import runus.runus.board.service.BoardService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @PostMapping
    public ResponseEntity<ApiResponse<Integer>> createBoard(@RequestBody BoardRequestDTO boardRequest) {
        System.out.println(boardRequest);
        int boardId = boardService.createBoard(boardRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, boardId, "글 작성 성공"));
    }

    // 게시글 목록, 키워드 검색 통합
    @GetMapping("/region")
    public ResponseEntity<ApiBoardResponse<List<BoardResponseDTO>>> getBoardsByRegion(
            @RequestParam int regionId,
            @RequestParam int size,
            @RequestParam int page,
            @RequestParam(required = false) String word,
            @RequestParam(required = false) String order) {
        Page<BoardResponseDTO> boards = null;

        // 검색 키워드 없는 경우
        if (word == null || word.isEmpty()) {
            if (order == null || order.isEmpty()) {  // 정렬 없음
                boards = boardService.getBoardsByRegion(regionId, size, page);
            } else if (order.equals("time")) {
                boards = boardService.getBoardsByTime(regionId, size, page);
            } else if (order.equals("incomplete")) {
                boards = boardService.getIncompleteBoards(regionId, size, page);
            }
        } else {  // 검색 키워드가 있는 경우
            if (order == null || order.isEmpty()) {  // 정렬 없음
                boards = boardService.searchBoards(regionId, word, size, page);
            } else if (order.equals("time")) {
                boards = boardService.getUpcomingBoardsKeyword(regionId, word, size, page);
            } else if (order.equals("incomplete")) {
                boards = boardService.getIncompleteBoardsKeyword(regionId, word, size, page);
            }
        }

        ApiBoardResponse<List<BoardResponseDTO>> response = new ApiBoardResponse<>();
        response.setResponseTrue(boards.stream().toList(), boards, "게시글 정보 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<ApiResponse<Void>> updateBoard(
            @PathVariable("boardId") int boardId,
            @RequestBody BoardRequestDTO boardRequest) {
        boardService.updateBoard(boardId, boardRequest);
        
        ApiResponse<Void> response = new ApiResponse<>();
        response.setResponseTrue(null, "게시글 수정 성공");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<ApiResponse<BoardResponseDTO>> getBoardDetails(@PathVariable("boardId") int boardId) {
        BoardResponseDTO board = boardService.getBoardDetails(boardId);
        return ResponseEntity.ok(new ApiResponse<>(true, board, "게시글 상세 내용 조회"));
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<ApiResponse<Void>> deleteBoard(@PathVariable("boardId") int boardId) {
        boardService.deleteBoard(boardId);
        return ResponseEntity.ok(new ApiResponse<>(true, null, "게시글 삭제 성공"));
    }
}
