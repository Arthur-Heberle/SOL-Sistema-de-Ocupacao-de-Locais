package br.edu.utfpr.sol.controller;

import br.edu.utfpr.sol.dto.SalaDTO;
import br.edu.utfpr.sol.entity.enums.TipoSala;
import br.edu.utfpr.sol.service.SalaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/salas")
public class SalaController {
    private final SalaService salaService;

    public SalaController(SalaService salaService) {
        this.salaService = salaService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
    public List<SalaDTO> listar(
        @RequestParam(required = false) String bloco,
        @RequestParam(required = false) TipoSala tipoSala,
        @RequestParam(required = false) Boolean permiteReserva
    ) {
        return salaService.listar(bloco, tipoSala, permiteReserva);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
    public SalaDTO buscar(@PathVariable Long id) {
        return salaService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('GESTOR')")
    public SalaDTO criar(@Valid @RequestBody SalaDTO dto) {
        return salaService.criar(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public SalaDTO atualizar(@PathVariable Long id, @Valid @RequestBody SalaDTO dto) {
        return salaService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public void remover(@PathVariable Long id) {
        salaService.remover(id);
    }
}
