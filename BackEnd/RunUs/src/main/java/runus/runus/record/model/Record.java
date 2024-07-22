package runus.runus.record.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private int record_id;

    @Column(name = "user_id", nullable = false)
    private int user_id;

    @Column(name = "party_id", nullable = false)
    private int party_id;

    @Column(name = "distance", nullable = true, columnDefinition = "int default 0")
    private Integer distance;

    @Column(name = "time", nullable = true, columnDefinition = "int default 0")
    private Integer time;

    @Column(name = "kcal", nullable = true, columnDefinition = "int default 0")
    private Integer kcal;

    @Column(name = "record_date", nullable = true, columnDefinition = "timestamp default current_timestamp")
    private LocalDateTime record_date;

}
