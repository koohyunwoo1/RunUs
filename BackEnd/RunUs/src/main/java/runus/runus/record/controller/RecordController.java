package runus.runus.record.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import runus.runus.record.model.Record;
import runus.runus.record.service.RecordService;
import runus.runus.user.entity.User;
import runus.runus.user.service.UserService;

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
    @GetMapping("/tier/{user_id}")
    // user의 tier_id 출력
    public Integer getUserTier(@PathVariable("user_id") Integer user_id) {
        Optional<User> user = userService.getUserById(user_id);
        return user.map(User::getTierId).orElse(null);
    }

    // 최근 기록
    // 전체 record 에서 맨 위에 있는 데이터 2개를 가져온다
    // record_date, party_id, distance, time, kcal 가져옴
    @GetMapping("/recent/{user_id}")
    public List<Record> getRecentRecords(@PathVariable("user_id") Integer user_id) {
        return recordService.getRecentRecords(user_id, 2);
    }

    // 모든 기록 가져오기
    @GetMapping("/all/{user_id}")
    public ResponseEntity<?> getAllRecords(@PathVariable("user_id") Integer user_id) {
        try {
            List<Record> records = recordService.getAllRecords(user_id);
            return new ResponseEntity<>(records, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // 지금까지 달린 총 거리
    @GetMapping("/total_distance/{user_id}")
    // record에서 모든 데이터의 distance를 합한 것 출력
    // == total_distance
    public Integer getTotalDistance(@PathVariable("user_id") Integer user_id) {
        return recordService.getTotalDistance(user_id);
    }

    // 년도 별 월 통계
    // registered_at
    // 2024-07-21
    // 의 데이터를 년도에 따라 분류해서 year로 받아
    // 그리고 월 별로 데이터를 모아서 distance를 다 더하고, time 을 다 더하여 리턴해줘야해
    // month : 1, totaldistance : 10000, time : 20000
    // month : 2, totaldistance : 1000, time : 2000


    //@GetMapping("/graph/{user_id}/{year}")
    // 년도 별 월 통계
    @GetMapping("/graph/{user_id}/{year}")
    public ResponseEntity<?> getMonthlyStatistics(@PathVariable("user_id") Integer user_id, @PathVariable("year") Integer year) {
        try {
            List<Map<String, Object>> stats = recordService.getMonthlyStatistics(user_id, year);
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
