package runus.runus.record.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import runus.runus.api.ApiResponse;
import runus.runus.record.common.ApiRecordResponse;
import runus.runus.record.dto.RecordDTO;
import runus.runus.record.dto.RecordSaveRequestDTO;
import runus.runus.record.entity.RecordEntity;
import runus.runus.record.service.RecordService;
import runus.runus.user.entity.User;
import runus.runus.user.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/record")
public class RecordController {

    private final RecordService recordService;
    private final UserService userService;

    // 티어 정보 보기
    @GetMapping("/tier")
    // user의 tier_id 출력
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserTier(@RequestParam Integer userId) {
        User user = userService.getUserEntityById(userId);
        Map<String, Object> data = new HashMap<>();
        data.put("tier_id", user.getTierId());

        ApiResponse<Map<String, Object>> response = new ApiResponse<>();
        response.setResponseTrue(data, "티어 정보 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 최근 기록
    // 전체 record 에서 맨 위에 있는 데이터 2개를 가져온다
    // record_date, party_id, distance, time, kcal 가져옴
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentRecords(@RequestParam Integer userId) {
        List<RecordEntity> records = recordService.getRecentRecords(userId, 2);
        
        ApiResponse<List<RecordEntity>> response = new ApiResponse<>();
        response.setResponseTrue(records, "최근 기록 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 모든 기록 가져오기
    @GetMapping("/all")
    public ResponseEntity<?> getAllRecords(@RequestParam int userId,
                                           @RequestParam int page,
                                           @RequestParam int size) {
        Page<RecordDTO> records = recordService.getRecords(userId, size, page);

        ApiRecordResponse<List<RecordDTO>> response = new ApiRecordResponse<>();
        response.setSuccess(records.stream().toList(), records, "모든 기록 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 지금까지 달린 총 거리
    @GetMapping("/total_distance")
    // record에서 모든 데이터의 distance를 합한 것 출력
    // == total_distance
    public ResponseEntity<?> getTotalDistance(@RequestParam Integer userId) {
        Integer totalDistance = recordService.getTotalDistance(userId);

        ApiResponse<Integer> response = new ApiResponse<>();
        response.setResponseTrue(totalDistance, "러닝 총 거리 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
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
    public ResponseEntity<?> getMonthlyStatistics(@RequestParam int userId, @PathVariable int year) {
        List<Map<String, Object>> stats = recordService.getMonthlyStatistics(userId, year);

        ApiResponse<List<Map<String, Object>>> response = new ApiResponse<>();
        response.setResponseTrue(stats, year + " 년도 월 통계 조회");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 러닝 데이터 저장
    @PostMapping("/result_save")
    public ResponseEntity<?> resultSave(@RequestBody RecordSaveRequestDTO requestDTO) {
        RecordEntity record = recordService.saveRecord(requestDTO);

        ApiResponse<RecordEntity> response = new ApiResponse<>();
        response.setResponseTrue(record, "달리기 기록 저장");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
