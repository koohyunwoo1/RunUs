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
    private int regionId;
    private LocalDateTime meetingTime;
    private String meetingDay;
    private String nickname;

//    // 게터와 세터 메서드
//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }
//
//    public String getContent() {
//        return content;
//    }
//
//    public void setContent(String content) {
//        this.content = content;
//    }
//
//    public int getRegionId() {
//        return regionId;
//    }
//
//    public void setRegionId(int regionId) {
//        this.regionId = regionId;
//    }
//
//    public LocalDateTime getMeetingTime() {
//        return meetingTime;
//    }
//
//    public void setMeetingTime(LocalDateTime meetingTime) {
//        this.meetingTime = meetingTime;
//    }
//
//    public String getMeetingDay() {
//        return meetingDay;
//    }
//
//    public void setMeetingDay(String meetingDay) {
//        this.meetingDay = meetingDay;
//    }
}
