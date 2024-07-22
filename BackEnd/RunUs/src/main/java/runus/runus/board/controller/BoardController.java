package runus.runus.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import runus.runus.board.common.ResponseMessage;
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
    public ResponseMessage createBoard(@RequestBody BoardRequestDTO boardRequest) {
        boardService.createBoard(boardRequest);
        return new ResponseMessage("글 작성 성공", null);
    }

    @GetMapping("/region/{region-id}")
    public ResponseMessage getBoardsByRegion(@PathVariable("region-id") int regionId,
                                             @RequestParam int size, @RequestParam int page) {
        List<BoardResponseDTO> boards = boardService.getBoardsByRegion(regionId, size, page);
        return new ResponseMessage("성공", boards);
    }

    @GetMapping("/region/{region-id}/time")
    public ResponseMessage getBoardsByTime(@PathVariable("region-id") int regionId,
                                           @RequestParam int size, @RequestParam int page) {
        List<BoardResponseDTO> boards = boardService.getBoardsByTime(regionId, size, page);
        return new ResponseMessage("성공", boards);
    }

    @GetMapping("/region/{region-id}/incomplete")
    public ResponseMessage getIncompleteBoards(@PathVariable("region-id") int regionId,
                                               @RequestParam int size, @RequestParam int page) {
        List<BoardResponseDTO> boards = boardService.getIncompleteBoards(regionId, size, page);
        return new ResponseMessage("성공", boards);
    }

    @GetMapping("/region/{region-id}/{word}")
    public ResponseMessage searchBoards(@PathVariable("region-id") int regionId,
                                        @PathVariable("word") String word,
                                        @RequestParam int size, @RequestParam int page) {
        List<BoardResponseDTO> boards = boardService.searchBoards(regionId, word, size, page);
        return new ResponseMessage("성공", boards);
    }

    @PutMapping("/{board-id}")
    public ResponseMessage updateBoard(@PathVariable("board-id") int boardId,
                                       @RequestBody BoardRequestDTO boardRequest) {
        boardService.updateBoard(boardId, boardRequest);
        return new ResponseMessage("글 수정 성공", null);
    }

    @GetMapping("/{board-id}")
    public ResponseMessage getBoardDetails(@PathVariable("board-id") int boardId) {
        BoardResponseDTO board = boardService.getBoardDetails(boardId);
        return new ResponseMessage("성공", board);
    }

    @DeleteMapping("/{board-id}")
    public ResponseMessage deleteBoard(@PathVariable("board-id") int boardId) {
        boardService.deleteBoard(boardId);
        return new ResponseMessage("글 삭제 성공", null);
    }
}
