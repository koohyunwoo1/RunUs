package runus.runus.board.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import runus.runus.board.entity.BoardEntity;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {
    List<BoardEntity> findByRegionIdAndIsDeleted(int regionId, char isDeleted, Pageable pageable);
    List<BoardEntity> findByRegionIdAndIsDeletedOrderByCreatedAtAsc(int regionId, char isDeleted, Pageable pageable);
    List<BoardEntity> findByRegionIdAndTitleContainingAndIsDeleted(int regionId, String title, char isDeleted, Pageable pageable);
}
