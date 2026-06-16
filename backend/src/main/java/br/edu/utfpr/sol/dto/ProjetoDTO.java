package br.edu.utfpr.sol.dto;

import br.edu.utfpr.sol.entity.enums.CategoriaProj;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProjetoDTO(
    Long id,
    @NotBlank @Size(max = 80) String nome,
    @NotBlank @Size(max = 1500) String descricao,
    @NotNull CategoriaProj categoria,
    Long idTutor,
    Long idSalaExclusiva,
    Boolean aprovado
) {
}
