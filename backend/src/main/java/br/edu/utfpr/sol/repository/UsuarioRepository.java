package br.edu.utfpr.sol.repository;

import br.edu.utfpr.sol.entity.Usuario;
import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<Usuario> findByTipoUsuario(TipoUsuario tipoUsuario);
}
