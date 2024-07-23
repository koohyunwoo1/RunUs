package runus.runus.board.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import runus.runus.board.entity.BoardEntity;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    List<BoardEntity> findByRegionId(int regionId, Pageable pageable);
    List<BoardEntity> findByRegionIdOrderByCreatedAtAsc(int regionId, Pageable pageable);
    List<BoardEntity> findByRegionIdAndIsDeleted(int regionId, char isDeleted, Pageable pageable);
    List<BoardEntity> findByRegionIdAndTitleContaining(int regionId, String title, Pageable pageable);
}
