package br.edu.utfpr.sol.controller;

import br.edu.utfpr.sol.dto.DisponibilidadeDTO;
import br.edu.utfpr.sol.dto.HorarioDTO;
import br.edu.utfpr.sol.service.CurrentUserService;
import br.edu.utfpr.sol.service.DisponibilidadeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projetos/{id}/disponibilidades")
@PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
public class DisponibilidadeController {
    private final DisponibilidadeService disponibilidadeService;
    private final CurrentUserService currentUserService;

    public DisponibilidadeController(DisponibilidadeService disponibilidadeService, CurrentUserService currentUserService) {
        this.disponibilidadeService = disponibilidadeService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public DisponibilidadeDTO salvar(@PathVariable Long id, @Valid @RequestBody DisponibilidadeDTO dto) {
        return disponibilidadeService.salvar(id, dto, currentUserService.requireCurrentUser());
    }

    @GetMapping
    public List<DisponibilidadeDTO> listar(@PathVariable Long id) {
        return disponibilidadeService.listar(id, currentUserService.requireCurrentUser());
    }

    @GetMapping("/intersecao")
    public List<HorarioDTO> intersecao(@PathVariable Long id) {
        return disponibilidadeService.intersecao(id, currentUserService.requireCurrentUser());
    }
}
