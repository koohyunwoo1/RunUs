package runus.runus.record.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordDTO {

    private Integer record_id;  // 레코드 ID
    private Integer user_id;    // 사용자 ID
    private Integer party_id;   // 파티 ID
    private Integer distance;   // 거리
    private Integer time;       // 시간
    private Integer kcal;// 칼로리

    private String record_date; // 기록 날짜 (타임스탬프 형태)

}
