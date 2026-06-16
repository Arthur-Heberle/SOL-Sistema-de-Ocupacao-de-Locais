package br.edu.utfpr.sol.controller;

import br.edu.utfpr.sol.dto.MembroProjetoDTO;
import br.edu.utfpr.sol.dto.ProjetoDTO;
import br.edu.utfpr.sol.dto.RejeicaoDTO;
import br.edu.utfpr.sol.service.CurrentUserService;
import br.edu.utfpr.sol.service.ProjetoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/projetos")
public class ProjetoController {
    private final ProjetoService projetoService;
    private final CurrentUserService currentUserService;

    public ProjetoController(ProjetoService projetoService, CurrentUserService currentUserService) {
        this.projetoService = projetoService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
    public List<ProjetoDTO> listar(@RequestParam(required = false) Boolean aprovado, @RequestParam(required = false) Long tutorId) {
        return projetoService.listar(aprovado, tutorId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
    public ProjetoDTO buscar(@PathVariable Long id) {
        return projetoService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROFESSOR','TUTOR','GESTOR')")
    public ProjetoDTO criar(@Valid @RequestBody ProjetoDTO dto) {
        return projetoService.criar(dto, currentUserService.requireCurrentUser());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESSOR','TUTOR','GESTOR')")
    public ProjetoDTO atualizar(@PathVariable Long id, @Valid @RequestBody ProjetoDTO dto) {
        return projetoService.atualizar(id, dto, currentUserService.requireCurrentUser());
    }

    @PatchMapping("/{id}/aprovar")
    @PreAuthorize("hasRole('GESTOR')")
    public ProjetoDTO aprovar(@PathVariable Long id) {
        return projetoService.aprovar(id);
    }

    @PatchMapping("/{id}/rejeitar")
    @PreAuthorize("hasRole('GESTOR')")
    public ProjetoDTO rejeitar(@PathVariable Long id, @Valid @RequestBody(required = false) RejeicaoDTO rejeicao) {
        return projetoService.rejeitar(id);
    }

    @GetMapping("/{id}/membros")
    @PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
    public List<MembroProjetoDTO> listarMembros(@PathVariable Long id) {
        return projetoService.listarMembros(id, currentUserService.requireCurrentUser());
    }

    @PostMapping("/{id}/membros")
    @PreAuthorize("hasAnyRole('PROFESSOR','TUTOR','GESTOR','ALUNO')")
    public MembroProjetoDTO adicionarMembro(@PathVariable Long id, @Valid @RequestBody MembroProjetoDTO dto) {
        return projetoService.adicionarMembro(id, dto, currentUserService.requireCurrentUser());
    }

    @DeleteMapping("/{id}/membros/{usuarioId}")
    @PreAuthorize("hasAnyRole('PROFESSOR','TUTOR','GESTOR','ALUNO')")
    public void removerMembro(@PathVariable Long id, @PathVariable Long usuarioId) {
        projetoService.removerMembro(id, usuarioId, currentUserService.requireCurrentUser());
    }

    @PatchMapping("/{id}/membros/{usuarioId}/gestor")
    @PreAuthorize("hasAnyRole('PROFESSOR','TUTOR','GESTOR')")
    public MembroProjetoDTO alterarGestor(
        @PathVariable Long id,
        @PathVariable Long usuarioId,
        @RequestParam boolean gestor
    ) {
        return projetoService.alterarGestor(id, usuarioId, gestor, currentUserService.requireCurrentUser());
    }
}
