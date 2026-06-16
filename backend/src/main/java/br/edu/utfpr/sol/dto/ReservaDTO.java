package br.edu.utfpr.sol.dto;

import br.edu.utfpr.sol.entity.enums.StatusReserva;
import br.edu.utfpr.sol.entity.enums.Visibilidade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record ReservaDTO(
    Long id,
    @NotNull Long idSala,
    Long idUsuario,
    Long idProjeto,
    Long idDisciplina,
    @NotBlank @Size(max = 80) String titulo,
    @Size(max = 500) String descricao,
    @NotNull Visibilidade visibilidade,
    @NotNull LocalDateTime dataInicio,
    @NotNull LocalDateTime dataFim,
    boolean recorrente,
    StatusReserva status
) {
}
