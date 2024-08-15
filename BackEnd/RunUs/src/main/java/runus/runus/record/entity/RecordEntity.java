package runus.runus.record.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "record")
public class RecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "record_id")
    private Integer recordId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "party_id", nullable = true)
    private Integer partyId;

    @Column(name = "distance", nullable = true, columnDefinition = "int default 0")
    private Integer distance;

    @Column(name = "time", nullable = true, columnDefinition = "int default 0")
    private Integer time;

    @Column(name = "kcal", nullable = true, columnDefinition = "int default 0")
    private Integer kcal;

    @Column(name = "record_date", nullable = true, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime recordDate;



    public LocalDate getRecordDate() {
        return recordDate != null ? recordDate.toLocalDate() : null;
    }
}
