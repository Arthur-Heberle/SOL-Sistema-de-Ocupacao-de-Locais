package br.edu.utfpr.sol.repository;

import br.edu.utfpr.sol.entity.Reserva;
import br.edu.utfpr.sol.entity.enums.StatusReserva;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByStatus(StatusReserva status);

    List<Reserva> findBySalaId(Long salaId);

    List<Reserva> findBySalaIdAndStatus(Long salaId, StatusReserva status);

    List<Reserva> findByUsuarioId(Long usuarioId);

    List<Reserva> findByProjetoId(Long projetoId);

    List<Reserva> findByDisciplinaId(Long disciplinaId);

    boolean existsByDisciplinaIdAndStatus(Long disciplinaId, StatusReserva status);
}
