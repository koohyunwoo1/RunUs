package runus.runus.webSocket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import runus.runus.webSocket.Entity.PartyEntity;
import runus.runus.webSocket.dto.PartyDto;


public interface PartyRepository extends JpaRepository<PartyEntity, Integer> {

}
