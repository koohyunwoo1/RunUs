package runus.runus.webSocket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import runus.runus.webSocket.Entity.PartyEntity;
import runus.runus.webSocket.dto.PartyDto;

import java.util.Optional;


public interface PartyRepository extends JpaRepository<PartyEntity, Integer> {

    Optional<PartyEntity> findByPartyId(int partyId);
}
