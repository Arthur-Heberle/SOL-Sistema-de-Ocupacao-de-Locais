package br.edu.utfpr.sol.controller;

import br.edu.utfpr.sol.dto.AuthTokenDTO;
import br.edu.utfpr.sol.dto.LoginDTO;
import br.edu.utfpr.sol.dto.UsuarioDTO;
import br.edu.utfpr.sol.mapper.SolMapper;
import br.edu.utfpr.sol.service.AuthService;
import br.edu.utfpr.sol.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final CurrentUserService currentUserService;
    private final SolMapper mapper;

    public AuthController(AuthService authService, CurrentUserService currentUserService, SolMapper mapper) {
        this.authService = authService;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @PostMapping("/login")
    public AuthTokenDTO login(@Valid @RequestBody LoginDTO login) {
        return authService.login(login);
    }

    @GetMapping("/me")
    public UsuarioDTO me() {
        return mapper.toDto(currentUserService.requireCurrentUser());
    }
}
