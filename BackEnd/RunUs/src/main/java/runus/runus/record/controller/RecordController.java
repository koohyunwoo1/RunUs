package runus.runus.record.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import runus.runus.record.model.Record;
import runus.runus.record.model.User;
import runus.runus.record.service.RecordService;
import runus.runus.record.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
        return user.map(User::getTier_id).orElse(null);
    }

    // 최근 기록
    @GetMapping("/recent/{user_id}")
    // 전체 record 에서 맨 위에 있는 데이터 2개를 가져온다
    // record_date, party_id, distance, time, kcal 가져옴
    public List<Record> getRecentRecords(@PathVariable("user_id") Integer user_id) {
        return recordService.getRecentRecords(user_id, 2);
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


    // 년도 별 월 통계
//    @GetMapping("/graph/{user_id}/{year}")

}
