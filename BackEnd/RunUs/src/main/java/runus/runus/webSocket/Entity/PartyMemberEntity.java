package runus.runus.webSocket.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "party_member")
public class PartyMemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int partyMemberId;

    @Column
    private int partyId;

    @Column
    private int userId;

    @Column
    private Timestamp joinedAt;

    @Column
    private Character role;

    @Column
    private Character partyMemberStatus;

}
