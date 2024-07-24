package runus.runus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import runus.runus.Entity.PartyEntity;


import java.util.Optional;

public interface QuotesRepository extends JpaRepository<PartyEntity, Integer> {
    @Query(value="SElECT content FROM quotes ORDER BY RAND() LIMIT 1" , nativeQuery = true)
    Optional<String> findRandomQuote();
}
