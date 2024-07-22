package runus.runus.record.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import runus.runus.record.model.Record;
import runus.runus.record.repository.RecordRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecordService {
    @Autowired
    private RecordRepository recordRepository;

    // 최근 기록 가져오기
    public List<Record> getRecentRecords(Integer user_id, int limit) {
        Pageable pageable = PageRequest.of(0,limit);
        return recordRepository.findTopByUser_idOrderByRecordDateDesc(user_id, pageable);
    }

    // 지금까지 달린 총 거리 계산
    public Integer getTotalDistance(Integer user_id) {
        return recordRepository.sumDistanceByUser_id(user_id);
    }

}
