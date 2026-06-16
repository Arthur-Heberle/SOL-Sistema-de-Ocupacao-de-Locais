package br.edu.utfpr.sol.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import br.edu.utfpr.sol.entity.Reserva;
import br.edu.utfpr.sol.entity.enums.StatusReserva;
import br.edu.utfpr.sol.repository.ReservaRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {
    @Mock
    ReservaRepository reservaRepository;

    @Test
    void detectsOneOffOverlapOnlyWhenPeriodsIntersect() {
        ReservaService service = service();
        Reserva existing = reserva(1L, false, "2026-08-03T08:00:00", "2026-08-03T10:00:00");
        when(reservaRepository.findBySalaIdAndStatus(10L, StatusReserva.APROVADA)).thenReturn(List.of(existing));

        assertTrue(service.hasConflict(10L, LocalDateTime.parse("2026-08-03T09:00:00"), LocalDateTime.parse("2026-08-03T11:00:00"), false, null));
        assertFalse(service.hasConflict(10L, LocalDateTime.parse("2026-08-03T10:00:00"), LocalDateTime.parse("2026-08-03T12:00:00"), false, null));
    }

    @Test
    void recurringConflictUsesSameWeekdayAndTimeWindow() {
        ReservaService service = service();
        Reserva existing = reserva(1L, true, "2026-08-03T08:00:00", "2026-12-14T10:00:00");
        when(reservaRepository.findBySalaIdAndStatus(10L, StatusReserva.APROVADA)).thenReturn(List.of(existing));

        assertTrue(service.hasConflict(10L, LocalDateTime.parse("2026-08-10T09:00:00"), LocalDateTime.parse("2026-12-21T11:00:00"), true, null));
        assertFalse(service.hasConflict(10L, LocalDateTime.parse("2026-08-11T09:00:00"), LocalDateTime.parse("2026-12-22T11:00:00"), true, null));
    }

    @Test
    void ignoresReservationBeingApprovedWhenRecheckingConflicts() {
        ReservaService service = service();
        Reserva existing = reserva(99L, true, "2026-08-03T08:00:00", "2026-12-14T10:00:00");
        when(reservaRepository.findBySalaIdAndStatus(10L, StatusReserva.APROVADA)).thenReturn(List.of(existing));

        assertFalse(service.hasConflict(10L, LocalDateTime.parse("2026-08-10T09:00:00"), LocalDateTime.parse("2026-12-21T11:00:00"), true, 99L));
    }

    private ReservaService service() {
        return new ReservaService(reservaRepository, null, null, null, null, null, null);
    }

    private Reserva reserva(Long id, boolean recorrente, String inicio, String fim) {
        Reserva reserva = new Reserva();
        reserva.setId(id);
        reserva.setStatus(StatusReserva.APROVADA);
        reserva.setRecorrente(recorrente);
        reserva.setDataInicio(LocalDateTime.parse(inicio));
        reserva.setDataFim(LocalDateTime.parse(fim));
        return reserva;
    }
}
