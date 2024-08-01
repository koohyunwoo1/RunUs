package runus.runus.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import runus.runus.board.entity.RegionMinor;

import java.util.List;

public interface RegionMinorRepository extends JpaRepository<RegionMinor, Integer> {
    List<RegionMinor> findByParentId(int parentId);
}
