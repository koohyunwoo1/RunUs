package runus.runus.record.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import runus.runus.record.dto.RecordDTO;
import runus.runus.record.model.Record;
import runus.runus.record.repository.RecordRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecordService {
    @Autowired
    private RecordRepository recordRepository;

    // 최근 기록 가져오기
    public List<Record> getRecentRecords(Integer userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return recordRepository.findTopByUser_idOrderByRecordDateDesc(userId, pageable);
    }


    // 전체 기록 가져오기
    public List<Record> getAllRecords(Integer userId) {
        List<Record> allRecords = new ArrayList<>();
        Pageable pageable = PageRequest.of(0, 6);  // 페이지 크기를 6으로 설정
        Page<Record> page;

        do {
            page = recordRepository.findByUser_id(userId, pageable);
            allRecords.addAll(page.getContent());
            pageable = pageable.next();
        } while (page.hasNext());

        return allRecords;
    }

    // 지금까지 달린 총 거리 계산
    public Integer getTotalDistance(Integer user_id) {
        return recordRepository.sumDistanceByUser_id(user_id);
    }

    public List<Map<String, Object>> getMonthlyStatistics(Integer userId, Integer year) {
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);

        List<Record> records = recordRepository.findByUserIdAndDateRange(userId, startOfYear, endOfYear);

        if (records == null || records.isEmpty()) {
            return Collections.emptyList();
        }

        Map<Integer, Map<String, Object>> monthlyStats = records.stream()
                .collect(Collectors.groupingBy(
                        record -> record.getRecordDate().getMonthValue(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                monthRecords -> {
                                    int totalDistance = monthRecords.stream().mapToInt(Record::getDistance).sum();
                                    int totalTime = monthRecords.stream().mapToInt(Record::getTime).sum();
                                    int recordCount = monthRecords.size();
                                    return Map.of("month", monthRecords.get(0).getRecordDate().getMonthValue(),
                                            "totalDistance", totalDistance,
                                            "totalTime", totalTime,
                                            "recordCount", recordCount);
                                }
                        )
                ));

        return monthlyStats.values().stream().collect(Collectors.toList());
    }

    // 러닝한 데이터를 저장
    public Record saveRecord(int userId, int partyId, Integer distance, Integer time, Integer kcal) {
        Record record = new Record();
        record.setUser_id(userId);
        record.setParty_id(partyId);
        record.setDistance(distance != null ? distance : 0);
        record.setTime(time != null ? time : 0);
        record.setKcal(kcal != null ? kcal : 0);
        record.setRecord_date(LocalDateTime.now());

        return recordRepository.save(record);
    }

}
