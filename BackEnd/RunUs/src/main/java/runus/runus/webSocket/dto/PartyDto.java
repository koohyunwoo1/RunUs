package runus.runus.webSocket.dto;

import jakarta.persistence.Column;
import jakarta.persistence.NamedEntityGraph;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PartyDto {
    private int partyId;

    private int owner_UserId;

    private int regionId;

    private char partyStatus;

    private Timestamp createdAt;

    private Timestamp finishedAt;

    private Timestamp deletedAt;

}
