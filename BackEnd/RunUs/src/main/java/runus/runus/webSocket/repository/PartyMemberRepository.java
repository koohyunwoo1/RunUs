package runus.runus.webSocket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import runus.runus.webSocket.Entity.PartyMemberEntity;
import runus.runus.webSocket.dto.PartyMemberDto;

import java.util.List;
import java.util.Optional;

public interface PartyMemberRepository extends JpaRepository<PartyMemberEntity, Integer> {
    Optional<PartyMemberEntity> findByPartyIdAndUserId(int partyId, int userId);
    List<PartyMemberEntity> findByPartyId(int partyId);


}
