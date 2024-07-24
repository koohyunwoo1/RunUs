package runus.runus.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
//null 들어갈 경우가 있을 때, integer

@Getter
@Setter
@Entity
@Table(name = "party")
public class PartyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int partyId;

    @Column
    private int owner_UserId;

    @Column
    private int regionId;

    @Column
    private char partyStatus;

    @Column
    private Timestamp createdAt;

    @Column
    private Timestamp finishedAt;

    @Column
    private Timestamp deletedAt;

}