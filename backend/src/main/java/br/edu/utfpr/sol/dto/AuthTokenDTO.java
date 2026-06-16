package br.edu.utfpr.sol.dto;

import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import java.time.LocalDateTime;

public record AuthTokenDTO(
    String token,
    LocalDateTime expiracao,
    UsuarioDTO usuario,
    Long idUsuario,
    String nome,
    TipoUsuario tipoUsuario
) {
}
