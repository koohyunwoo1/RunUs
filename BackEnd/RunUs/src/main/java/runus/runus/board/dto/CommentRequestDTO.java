package runus.runus.board.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDTO {
    private Integer parentId; // 부모 댓글 ID (선택적)
    private int userId;       // 댓글 작성자 ID
    private String content;   // 댓글 내용
}
