package br.edu.utfpr.sol.repository;

import br.edu.utfpr.sol.entity.Disponibilidade;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Long> {
    List<Disponibilidade> findByProjetoId(Long projetoId);

    List<Disponibilidade> findByProjetoIdAndUsuarioId(Long projetoId, Long usuarioId);

    void deleteByProjetoIdAndUsuarioId(Long projetoId, Long usuarioId);
}
