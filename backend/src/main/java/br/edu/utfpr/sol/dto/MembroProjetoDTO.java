package br.edu.utfpr.sol.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record MembroProjetoDTO(
    Long id,
    @NotNull Long idUsuario,
    Long idProjeto,
    String nomeUsuario,
    String emailUsuario,
    boolean isGestor,
    LocalDate dataIngresso
) {
}
