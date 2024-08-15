package runus.runus.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
//@AllArgsConstructor
public class BoardResponseDTO {
    private int boardId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int regionId;
    private LocalDateTime meetingTime;
    private String meetingDay;
    private String nickname;
    private char isDeleted;
    private Integer exp;

    // 생성자 내부에서 exp가 null인 경우 0으로 설정
    public BoardResponseDTO(int boardId, String title, String content, LocalDateTime createdAt, LocalDateTime updatedAt, int regionId, LocalDateTime meetingTime, String meetingDay, String nickname, char isDeleted, Integer exp) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.regionId = regionId;
        this.meetingTime = meetingTime;
        this.meetingDay = meetingDay;
        this.nickname = nickname;
        this.isDeleted = isDeleted;
        this.exp = (exp != null) ? exp : 0;  // null일 경우 0으로 설정
    }
}
