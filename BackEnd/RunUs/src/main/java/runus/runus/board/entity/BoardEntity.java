package runus.runus.board.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "board")
public class BoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int boardId;
    private int userId;

    private String title;
    private String content;
    private int regionId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "is_deleted")
    private char isDeleted;

    @Column(name = "meeting_time")
    private LocalDateTime meetingTime;

    @Column(name = "meeting_day")
    private String meetingDay;

    @Column(name = "nickname")
    private String nickname;

    // Lombok이 자동으로 세터와 게터를 생성합니다.
}
