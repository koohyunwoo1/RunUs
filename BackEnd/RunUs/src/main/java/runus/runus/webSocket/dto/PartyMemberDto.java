package runus.runus.webSocket.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PartyMemberDto {
    private int partyMemberId;
    private int partyId;
    private int userId;
    private Timestamp joinedAt;
    private Character role;
    private Character partyMemberStatus;
}
