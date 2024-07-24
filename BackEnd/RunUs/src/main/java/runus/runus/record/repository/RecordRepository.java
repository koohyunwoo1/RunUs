package runus.runus.record.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import runus.runus.record.model.Record;
import java.time.LocalDateTime;
import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Integer> {

    // 사용자 ID 로 최신 기록 조회
    @Query(value = "SELECT r FROM Record r WHERE r.user_id = ?1 ORDER BY r.record_date DESC ")
    List<Record> findTopByUser_idOrderByRecordDateDesc(Integer user_id, Pageable pageable);

    // 사용자 ID로 페이지네이션을 통한 모든 기록 조회
    @Query("SELECT r FROM Record r WHERE r.user_id = :userId")
    Page<Record> findByUser_id(@Param("userId") Integer userId, Pageable pageable);

    // 사용자 ID로 모든 기록의 거리 합계 계산
    @Query(value = "SELECT SUM(r.distance) FROM Record r WHERE r.user_id =?1")
    Integer sumDistanceByUser_id(Integer user_id);

    @Query("SELECT r FROM Record r WHERE r.user_id = :userId AND r.record_date BETWEEN :startOfYear AND :endOfYear")
    List<Record> findByUserIdAndDateRange(@Param("userId") Integer userId, @Param("startOfYear") LocalDateTime startOfYear, @Param("endOfYear") LocalDateTime endOfYear);

}
