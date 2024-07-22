package runus.runus.board.repository;

import runus.runus.board.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

    @Query("SELECT b FROM BoardEntity b WHERE b.regionId = :regionId ORDER BY b.createdAt DESC")
    List<BoardEntity> findByRegionId(@Param("regionId") int regionId);

    @Query("SELECT b FROM BoardEntity b WHERE b.regionId = :regionId ORDER BY b.createdAt DESC")
    List<BoardEntity> findByRegionIdOrderByCreatedAtDesc(@Param("regionId") int regionId);

    @Query("SELECT b FROM BoardEntity b WHERE b.regionId = :regionId AND b.isDeleted = '0'")
    List<BoardEntity> findByRegionIdAndIncomplete(@Param("regionId") int regionId);

    @Query("SELECT b FROM BoardEntity b WHERE b.regionId = :regionId AND b.title LIKE %:word% ORDER BY b.createdAt DESC")
    List<BoardEntity> searchByKeyword(@Param("regionId") int regionId, @Param("word") String word);
}
