package br.edu.utfpr.sol.service;

import br.edu.utfpr.sol.entity.Usuario;
import br.edu.utfpr.sol.exception.NotFoundException;
import br.edu.utfpr.sol.repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
    private final UsuarioRepository usuarioRepository;

    public CurrentUserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario requireCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new NotFoundException("Usuário autenticado não encontrado."));
    }
}
