package runus.runus.board.dto;

import lombok.Data;

@Data
public class BoardRequestDTO {
    private String title;
    private String content;
    private int regionId;
    private String meetingTime;
    private String meetingDay;
}
