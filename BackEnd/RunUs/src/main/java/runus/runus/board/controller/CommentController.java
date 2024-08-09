package runus.runus.board.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.api.ApiResponse;
import runus.runus.api.InvalidDataException;
import runus.runus.board.common.ApiCommentResponse;
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
    @PostMapping("/comments")
    public ResponseEntity<ApiResponse<Integer>> createComment(@RequestBody CommentRequestDTO commentRequest) {
        if (commentRequest.getContent() == null || commentRequest.getContent().isEmpty()) {
            throw new InvalidDataException("댓글 내용이 필요합니다");
        }
        commentService.createComment(commentRequest);

        ApiResponse<Integer> response = new ApiResponse<>();
        response.setResponseTrue(null, "댓글 작성 성공");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 댓글 수정
    @PutMapping("/comments")
    public ResponseEntity<ApiResponse<Integer>> updateComment(@RequestBody CommentRequestDTO commentRequest) {
        if (commentRequest.getContent() == null || commentRequest.getContent().isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>(false, null,"댓글 내용이 필요합니다."));
        }
        commentService.updateComment(commentRequest);
        
        ApiResponse<Integer> response = new ApiResponse<>();
        response.setResponseTrue(null, "댓글 수정 성공");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 댓글 삭제
    @DeleteMapping("/comments")
    public ResponseEntity<ApiResponse<Integer>> deleteComment(@RequestBody CommentRequestDTO commentRequest) {
        commentService.deleteComment(commentRequest);
        
        ApiResponse<Integer> response = new ApiResponse<>();
        response.setResponseTrue(null, "댓글 삭제 성공");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 댓글 목록 조회
    @GetMapping("/comments")
    public ResponseEntity<ApiCommentResponse<List<CommentResponseDTO>>> getComments(@RequestParam int boardId,
                                                                                    @RequestParam int size,
                                                                                    @RequestParam int page) {
        Page<CommentResponseDTO> comments = commentService.getComments(boardId, size, page);

        ApiCommentResponse<List<CommentResponseDTO>> response = new ApiCommentResponse<>();
        response.setSuccess(comments.stream().toList(), comments, "댓글 목록 조회 성공");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
