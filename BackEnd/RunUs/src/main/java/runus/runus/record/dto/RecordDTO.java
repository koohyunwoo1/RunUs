package runus.runus.record.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordDTO {

    private int record_id;  // 레코드 ID
    private int user_id;    // 사용자 ID
    private int party_id;   // 파티 ID
    private int distance;   // 거리
    private int time;       // 시간
    private int kcal;// 칼로리

    private String record_date; // 기록 날짜 (타임스탬프 형태)

}
