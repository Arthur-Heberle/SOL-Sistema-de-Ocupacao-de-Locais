package br.edu.utfpr.sol.dto;

import br.edu.utfpr.sol.entity.enums.TipoSala;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SalaDTO(
    Long id,
    @NotBlank @Size(max = 10) String bloco,
    @NotBlank @Size(max = 20) String codigoNome,
    @NotNull TipoSala tipoSala,
    @NotNull @Min(1) Integer capacidade,
    Boolean possuiProjetor,
    Boolean permiteReserva,
    @Size(max = 500) String descricao
) {
}
