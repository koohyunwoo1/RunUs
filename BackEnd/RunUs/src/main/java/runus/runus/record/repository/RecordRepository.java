package runus.runus.record.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import runus.runus.record.dto.RecordDTO;
import runus.runus.record.entity.RecordEntity;
import java.time.LocalDateTime;
import java.util.List;

public interface RecordRepository extends JpaRepository<RecordEntity, Integer> {

    // 사용자 ID 로 최신 기록 조회
    @Query(value = "SELECT r FROM RecordEntity r WHERE r.userId = ?1 ORDER BY r.recordDate DESC ")
    List<RecordEntity> findTopByUser_idOrderByRecordDateDesc(Integer user_id, Pageable pageable);

    // 사용자 ID로 페이지네이션을 통한 모든 기록 조회 - refactor
    @Query("SELECT new runus.runus.record.dto.RecordDTO(r.recordId, r.userId, r.partyId, r.distance, r.time, r.kcal, r.recordDate) FROM RecordEntity r WHERE r.userId = :userId ORDER BY r.recordId DESC")
    Page<RecordDTO> findRecord(@Param("userId") int userId, Pageable pageable);

    // 사용자 ID로 모든 기록의 거리 합계 계산
    @Query(value = "SELECT SUM(r.distance) FROM RecordEntity r WHERE r.userId =?1")
    Integer sumDistanceByUserId(Integer user_id);

    // 사용자 ID와 기간으로 기록 조회
    @Query("SELECT r FROM RecordEntity r WHERE r.userId = :userId AND r.recordDate BETWEEN :startOfYear AND :endOfYear")
    List<RecordEntity> findByUserIdAndDateRange(@Param("userId") Integer userId, @Param("startOfYear") LocalDateTime startOfYear, @Param("endOfYear") LocalDateTime endOfYear);

}
