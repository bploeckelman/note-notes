package lando.systems.notenotes.data.repository;

import lando.systems.notenotes.data.entity.Notation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotationRepository extends CrudRepository<Notation, Long> {
}
