package runus.runus.board.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentRequestDTO {
    private Integer parentId; // 부모 댓글 ID (선택적)
    private int userId;       // 댓글 작성자 ID
    private String content;   // 댓글 내용
    private int boardId;
    private int commentId;
}
