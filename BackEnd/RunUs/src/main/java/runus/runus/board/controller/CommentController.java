package runus.runus.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.board.common.ResponseMessage;
import runus.runus.board.dto.CommentRequestDTO;
import runus.runus.board.dto.CommentResponseDTO;
import runus.runus.board.service.CommentService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 댓글 작성
    @PostMapping("/{boardId}/comments")
    public ResponseEntity<ResponseMessage> createComment(@PathVariable int boardId, @RequestBody CommentRequestDTO commentRequest) {
        if (commentRequest.getContent() == null || commentRequest.getContent().isEmpty()) {
            return new ResponseEntity<>(new ResponseMessage("댓글 내용이 필요합니다.", null), HttpStatus.BAD_REQUEST);
        }

        commentService.createComment(boardId, commentRequest);
        return new ResponseEntity<>(new ResponseMessage("댓글 작성 성공", null), HttpStatus.CREATED);
    }

    // 댓글 수정
    @PutMapping("/{boardId}/comments/{commentId}")
    public ResponseEntity<ResponseMessage> updateComment(@PathVariable int boardId, @PathVariable int commentId, @RequestBody CommentRequestDTO commentRequest) {
        if (commentRequest.getContent() == null || commentRequest.getContent().isEmpty()) {
            return new ResponseEntity<>(new ResponseMessage("댓글 내용이 필요합니다.", null), HttpStatus.BAD_REQUEST);
        }

        commentService.updateComment(boardId, commentId, commentRequest);
        return new ResponseEntity<>(new ResponseMessage("댓글 수정 성공", null), HttpStatus.OK);
    }

    // 댓글 삭제
    @DeleteMapping("/{boardId}/comments/{commentId}")
    public ResponseEntity<ResponseMessage> deleteComment(@PathVariable int boardId, @PathVariable int commentId) {
        commentService.deleteComment(boardId, commentId);
        return new ResponseEntity<>(new ResponseMessage("댓글 삭제 성공", null), HttpStatus.NO_CONTENT);
    }

    // 댓글 목록 조회
    @GetMapping("/{boardId}/comments")
    public ResponseEntity<ResponseMessage> getComments(@PathVariable int boardId,
                                                       @RequestParam int size,
                                                       @RequestParam int page) {
        List<CommentResponseDTO> comments = commentService.getComments(boardId, size, page);
        return new ResponseEntity<>(new ResponseMessage("댓글 목록 조회 성공", comments), HttpStatus.OK);
    }
}
