package runus.runus.board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class BoardResponseDTO {
    private int boardId;
    private String title;
    private String content;
    private String nickname;  // 작성자 닉네임 추가
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int regionId;
    private LocalDateTime meetingTime;
    private String meetingDay;



    // Lombok이 자동으로 게터와 세터를 생성합니다.
}
