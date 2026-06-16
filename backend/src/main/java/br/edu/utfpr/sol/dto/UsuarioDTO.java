package br.edu.utfpr.sol.dto;

import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UsuarioDTO(
    Long id,
    @NotBlank @Size(max = 80) String nome,
    @NotBlank @Email @Size(max = 80) String email,
    @NotNull TipoUsuario tipoUsuario,
    Boolean ativo
) {
}
