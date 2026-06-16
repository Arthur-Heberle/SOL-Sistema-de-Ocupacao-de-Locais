package br.edu.utfpr.sol.controller;

import br.edu.utfpr.sol.dto.UsuarioDTO;
import br.edu.utfpr.sol.dto.UsuarioRequestDTO;
import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import br.edu.utfpr.sol.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('GESTOR')")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioDTO> listar(@RequestParam(required = false) TipoUsuario tipoUsuario, @RequestParam(required = false) Boolean ativo) {
        return usuarioService.listar(tipoUsuario, ativo);
    }

    @GetMapping("/{id}")
    public UsuarioDTO buscar(@PathVariable Long id) {
        return usuarioService.buscar(id);
    }

    @PostMapping
    public UsuarioDTO criar(@Valid @RequestBody UsuarioRequestDTO dto) {
        return usuarioService.criar(dto);
    }

    @PutMapping("/{id}")
    public UsuarioDTO atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequestDTO dto) {
        return usuarioService.atualizar(id, dto);
    }

    @PatchMapping("/{id}/ativar")
    public UsuarioDTO ativar(@PathVariable Long id) {
        return usuarioService.ativar(id);
    }

    @PatchMapping("/{id}/inativar")
    public UsuarioDTO inativar(@PathVariable Long id) {
        return usuarioService.inativar(id);
    }
}
