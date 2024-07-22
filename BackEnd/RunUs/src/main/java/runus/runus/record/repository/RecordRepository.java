package runus.runus.record.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import runus.runus.record.model.Record;

import java.util.List;
import java.util.Map;

public interface RecordRepository extends JpaRepository<Record, Integer> {

    // 사용자 ID 로 최신 기록 조회
    @Query(value = "SELECT r FROM Record r WHERE r.user_id = ?1 ORDER BY r.record_date DESC ")
    List<Record> findTopByUser_idOrderByRecordDateDesc(Integer user_id, Pageable pageable);

    // 사용자 ID로 모든 기록의 거리 합계 계산
    @Query(value = "SELECT SUM(r.distance) FROM Record r WHERE r.user_id =?1")
    Integer sumDistanceByUser_id(Integer user_id);

}
