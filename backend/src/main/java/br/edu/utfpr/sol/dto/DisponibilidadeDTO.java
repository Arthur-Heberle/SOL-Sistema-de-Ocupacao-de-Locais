package br.edu.utfpr.sol.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record DisponibilidadeDTO(
    Long idUsuario,
    Long idProjeto,
    @NotNull @Valid List<HorarioDTO> matrizHorarios
) {
}
