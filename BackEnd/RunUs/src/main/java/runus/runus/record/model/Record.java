package runus.runus.record.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "record")
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "record_id")
    private Integer record_id;

    @Column(name = "user_id", nullable = false)
    private Integer user_id;

    @Column(name = "party_id", nullable = true)
    private Integer party_id;

    @Column(name = "distance", nullable = true, columnDefinition = "int default 0")
    private Integer distance;

    @Column(name = "time", nullable = true, columnDefinition = "int default 0")
    private Integer time;

    @Column(name = "kcal", nullable = true, columnDefinition = "int default 0")
    private Integer kcal;

    @Column(name = "record_date", nullable = true, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime record_date;



    public LocalDate getRecordDate() {
        return record_date != null ? record_date.toLocalDate() : null;
    }
}