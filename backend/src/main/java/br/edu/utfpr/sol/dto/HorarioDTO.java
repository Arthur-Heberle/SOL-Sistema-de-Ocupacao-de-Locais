package br.edu.utfpr.sol.dto;

import br.edu.utfpr.sol.entity.enums.DiaSemana;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public record HorarioDTO(
    @NotNull DiaSemana diaSemana,
    @NotNull LocalTime horaInicio,
    @NotNull LocalTime horaFim
) {
}
