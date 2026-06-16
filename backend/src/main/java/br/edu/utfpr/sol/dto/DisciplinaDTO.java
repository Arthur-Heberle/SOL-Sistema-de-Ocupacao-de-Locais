package br.edu.utfpr.sol.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DisciplinaDTO(
    Long id,
    @NotBlank @Size(max = 20) String codigo,
    @NotBlank @Size(max = 80) String nome,
    @NotBlank @Pattern(regexp = "\\d{4}/[12]") String semestre,
    @NotNull Long idProfessor,
    @NotNull @Min(1) Integer cargaHoraria,
    @NotBlank @Size(max = 10) String turma
) {
}
