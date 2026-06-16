package br.edu.utfpr.sol.repository;

import br.edu.utfpr.sol.entity.Sala;
import br.edu.utfpr.sol.entity.enums.TipoSala;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaRepository extends JpaRepository<Sala, Long> {
    boolean existsByCodigoNomeIgnoreCase(String codigoNome);

    List<Sala> findByAtivoTrue();

    List<Sala> findByBlocoIgnoreCaseAndAtivoTrue(String bloco);

    List<Sala> findByTipoSalaAndAtivoTrue(TipoSala tipoSala);
}
