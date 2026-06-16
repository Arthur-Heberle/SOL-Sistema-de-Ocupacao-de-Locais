package br.edu.utfpr.sol.service;

import br.edu.utfpr.sol.dto.AuthTokenDTO;
import br.edu.utfpr.sol.dto.LoginDTO;
import br.edu.utfpr.sol.exception.ForbiddenException;
import br.edu.utfpr.sol.mapper.SolMapper;
import br.edu.utfpr.sol.repository.UsuarioRepository;
import br.edu.utfpr.sol.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final SolMapper mapper;

    public AuthService(
        AuthenticationManager authenticationManager,
        UsuarioRepository usuarioRepository,
        JwtService jwtService,
        SolMapper mapper
    ) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.mapper = mapper;
    }

    public AuthTokenDTO login(LoginDTO login) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(login.email(), login.senha())
        );
        var usuario = usuarioRepository.findByEmailIgnoreCase(login.email())
            .orElseThrow(() -> new ForbiddenException("Usuário não encontrado."));
        if (!usuario.isAtivo()) {
            throw new ForbiddenException("Usuário inativo.");
        }
        var token = jwtService.generate(usuario);
        return new AuthTokenDTO(
            token.token(),
            token.expiresAt(),
            mapper.toDto(usuario),
            usuario.getId(),
            usuario.getNome(),
            usuario.getTipoUsuario()
        );
    }
}
