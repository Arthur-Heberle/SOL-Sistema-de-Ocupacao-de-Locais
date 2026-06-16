package br.edu.utfpr.sol.controller;

import br.edu.utfpr.sol.dto.RejeicaoDTO;
import br.edu.utfpr.sol.dto.ReservaDTO;
import br.edu.utfpr.sol.entity.enums.StatusReserva;
import br.edu.utfpr.sol.service.CurrentUserService;
import br.edu.utfpr.sol.service.ReservaService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservas")
@PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
public class ReservaController {
    private final ReservaService reservaService;
    private final CurrentUserService currentUserService;

    public ReservaController(ReservaService reservaService, CurrentUserService currentUserService) {
        this.reservaService = reservaService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<ReservaDTO> listar(
        @RequestParam(required = false) Long idSala,
        @RequestParam(required = false) Long idUsuario,
        @RequestParam(required = false) Long idProjeto,
        @RequestParam(required = false) Long idDisciplina,
        @RequestParam(required = false) StatusReserva status,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim
    ) {
        return reservaService.listar(idSala, idUsuario, idProjeto, idDisciplina, status, inicio, fim, currentUserService.requireCurrentUser());
    }

    @GetMapping("/pendentes")
    public List<ReservaDTO> pendentes() {
        return reservaService.pendentes(currentUserService.requireCurrentUser());
    }

    @GetMapping("/{id}")
    public ReservaDTO buscar(@PathVariable Long id) {
        return reservaService.buscar(id, currentUserService.requireCurrentUser());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROFESSOR','TUTOR','GESTOR')")
    public ReservaDTO criar(@Valid @RequestBody ReservaDTO dto) {
        return reservaService.criar(dto, currentUserService.requireCurrentUser());
    }

    @PatchMapping("/{id}/aprovar")
    @PreAuthorize("hasRole('GESTOR')")
    public ReservaDTO aprovar(@PathVariable Long id) {
        return reservaService.aprovar(id);
    }

    @PatchMapping("/{id}/rejeitar")
    @PreAuthorize("hasRole('GESTOR')")
    public ReservaDTO rejeitar(@PathVariable Long id, @Valid @RequestBody(required = false) RejeicaoDTO rejeicao) {
        return reservaService.rejeitar(id);
    }

    @PatchMapping("/{id}/cancelar")
    public ReservaDTO cancelar(@PathVariable Long id) {
        return reservaService.cancelar(id, currentUserService.requireCurrentUser());
    }
}
