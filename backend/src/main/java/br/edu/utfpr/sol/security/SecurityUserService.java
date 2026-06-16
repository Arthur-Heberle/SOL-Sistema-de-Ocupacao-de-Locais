package br.edu.utfpr.sol.security;

import br.edu.utfpr.sol.repository.UsuarioRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class SecurityUserService implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;

    public SecurityUserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findByEmailIgnoreCase(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));

        return new User(
            usuario.getEmail(),
            usuario.getSenhaHash(),
            usuario.isAtivo(),
            true,
            true,
            true,
            List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getTipoUsuario().name()))
        );
    }
}
