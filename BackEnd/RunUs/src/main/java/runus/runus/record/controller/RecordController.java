package runus.runus.record.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.api.ApiResponse;
import runus.runus.record.model.Record;
import runus.runus.record.service.RecordService;
import runus.runus.user.entity.User;
import runus.runus.user.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/record")
public class RecordController {

    private final RecordService recordService;
    private final UserService userService;

    // 티어 정보 보기
    @GetMapping("/tier")
    // user의 tier_id 출력
    public ResponseEntity<?> getUserTier(@RequestParam("user_id") Integer user_id) {
        Optional<User> user = userService.getUserById(user_id);
        Map<String, Object> data = new HashMap<>();
        data.put("tier_id", user.map(User::getTierId).orElse(null));
        return ResponseEntity.ok(new ApiResponse<>(true, data, "티어 조회 성공"));
    }

    // 최근 기록
    // 전체 record 에서 맨 위에 있는 데이터 2개를 가져온다
    // record_date, party_id, distance, time, kcal 가져옴
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentRecords(@RequestParam("user_id") Integer user_id) {
        List<Record> records = recordService.getRecentRecords(user_id, 2);
        return ResponseEntity.ok(new ApiResponse<>(true, records, "최근 기록 조회 성공"));
    }

    // 모든 기록 가져오기
    @GetMapping("/all")
    public ResponseEntity<?> getAllRecords(@RequestParam("user_id") Integer user_id) {
        try {
            List<Record> records = recordService.getAllRecords(user_id);
            return ResponseEntity.ok(new ApiResponse<>(true, records, "모든 기록 가져오기 성공"));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse<>(false, e.getMessage(), "기록 가져오기 실패"));
        }
    }

    // 지금까지 달린 총 거리
    @GetMapping("/total_distance")
    // record에서 모든 데이터의 distance를 합한 것 출력
    // == total_distance
    public ResponseEntity<?> getTotalDistance(@RequestParam("user_id") Integer user_id) {
        return ResponseEntity.ok(new ApiResponse<>(true, recordService.getTotalDistance(user_id), "러닝 총 거리 조회 성공"));
    }

    // 년도 별 월 통계
    // registered_at
    // 2024-07-21
    // 의 데이터를 년도에 따라 분류해서 year로 받아
    // 그리고 월 별로 데이터를 모아서 distance를 다 더하고, time 을 다 더하여 리턴해줘야해
    // month : 1, totaldistance : 10000, time : 20000
    // month : 2, totaldistance : 1000, time : 2000

    // 년도 별 월 통계
    @GetMapping("/graph/{year}")
    public ResponseEntity<?> getMonthlyStatistics(@RequestParam("user_id") Integer user_id, @PathVariable("year") Integer year) {
        try {
            List<Map<String, Object>> stats = recordService.getMonthlyStatistics(user_id, year);
            return ResponseEntity.ok(new ApiResponse<>(true,stats,"년도 별 월 통계 조회 성공"));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse<>(false, e.getMessage(), "년도 별 월 통계 조회 실패"));
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 러닝 데이터 저장
    @PostMapping("/result_save")
    public ResponseEntity<?> resultSave(
            @RequestParam("user_id") Integer userId,
            @RequestParam("party_id") Integer partyId,
            @RequestParam(value = "distance", required = false) Integer distance,
            @RequestParam(value = "time", required = false) Integer time,
            @RequestParam(value = "kcal", required = false) Integer kcal) {
        try {
            Record record = recordService.saveRecord(userId, partyId, distance, time, kcal);
            return ResponseEntity.ok(new ApiResponse<>(true, record, "기록 저장 성공"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), "기록 저장 실패"));
        }
    }

}
