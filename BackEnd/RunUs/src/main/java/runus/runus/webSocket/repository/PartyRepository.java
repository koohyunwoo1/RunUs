package runus.runus.webSocket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import runus.runus.webSocket.Entity.PartyEntity;


public interface PartyRepository extends JpaRepository<PartyEntity, Integer> {

}
