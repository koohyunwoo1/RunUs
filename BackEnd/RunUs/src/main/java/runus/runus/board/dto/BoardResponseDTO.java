package runus.runus.board.dto;

import lombok.Data;

@Data
public class BoardResponseDTO {
    private String title;
    private String content;
    private String nickname;
    private String createdAt;
    private int region;
    private String meetingTime;
    private String meetingDay;
}
