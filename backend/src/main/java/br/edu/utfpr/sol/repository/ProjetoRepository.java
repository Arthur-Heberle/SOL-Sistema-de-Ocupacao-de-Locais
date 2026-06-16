package br.edu.utfpr.sol.repository;

import br.edu.utfpr.sol.entity.Projeto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    List<Projeto> findByAprovado(boolean aprovado);

    List<Projeto> findByTutorId(Long tutorId);

    Optional<Projeto> findBySalaExclusivaId(Long salaId);
}
