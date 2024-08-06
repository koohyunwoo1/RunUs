package runus.runus.board.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import runus.runus.board.entity.BoardEntity;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    Page<BoardEntity> findByRegionIdAndIsDeleted(int regionId, char isDeleted, Pageable pageable);
    Page<BoardEntity> findByRegionIdAndIsDeletedOrderByCreatedAtAsc(int regionId, char isDeleted, Pageable pageable);
    Page<BoardEntity> findByRegionIdAndTitleContainingAndIsDeleted(int regionId, String title, char isDeleted, Pageable pageable);

    // 게시글 목록
    @Query(value = "SELECT b.*, COALESCE(u.nickname, 'undefined') AS nickname " +
            "FROM board b LEFT JOIN user u ON b.user_id = u.user_id " +
            "WHERE b.region_id = :regionId AND b.is_deleted = :isDeleted",
            countQuery = "SELECT count(*) FROM board b WHERE b.region_id = :regionId AND b.is_deleted = :isDeleted",
            nativeQuery = true)
    Page<BoardEntity> findByRegionIdAndIsDeletedWithNickname(@Param("regionId") int regionId, @Param("isDeleted") char isDeleted, Pageable pageable);

    @Query("SELECT b FROM BoardEntity b WHERE b.regionId = :regionId AND b.isDeleted = :isDeleted AND b.meetingTime >= CURRENT_TIMESTAMP ORDER BY b.meetingTime ASC")
    Page<BoardEntity> findUpcomingMeetings(@Param("regionId") int regionId, @Param("isDeleted") char isDeleted, Pageable pageable);
}
