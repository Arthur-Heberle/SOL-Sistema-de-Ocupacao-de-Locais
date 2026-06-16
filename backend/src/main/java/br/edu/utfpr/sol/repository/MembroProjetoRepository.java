package br.edu.utfpr.sol.repository;

import br.edu.utfpr.sol.entity.MembroProjeto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembroProjetoRepository extends JpaRepository<MembroProjeto, Long> {
    List<MembroProjeto> findByProjetoId(Long projetoId);

    List<MembroProjeto> findByUsuarioId(Long usuarioId);

    Optional<MembroProjeto> findByProjetoIdAndUsuarioId(Long projetoId, Long usuarioId);

    boolean existsByProjetoIdAndUsuarioId(Long projetoId, Long usuarioId);

    void deleteByProjetoIdAndUsuarioId(Long projetoId, Long usuarioId);
}
