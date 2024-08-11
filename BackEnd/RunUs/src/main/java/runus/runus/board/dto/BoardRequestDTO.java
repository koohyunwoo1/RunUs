package runus.runus.board.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class BoardRequestDTO {
    private int userId;
    private String title;
    private String content;
    private Integer regionId;
    private LocalDateTime meetingTime;
    private String meetingDay;
    private String nickname;

}
