package runus.runus.record.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class RecordSaveRequestDTO {
    private Integer userId;
    private Integer partyId;
    private Integer distance;
    private Integer time;
    private Integer kcal;
}
