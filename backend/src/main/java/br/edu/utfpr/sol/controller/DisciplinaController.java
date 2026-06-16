package br.edu.utfpr.sol.controller;

import br.edu.utfpr.sol.dto.DisciplinaDTO;
import br.edu.utfpr.sol.service.DisciplinaService;
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
@RequestMapping("/api/disciplinas")
public class DisciplinaController {
    private final DisciplinaService disciplinaService;

    public DisciplinaController(DisciplinaService disciplinaService) {
        this.disciplinaService = disciplinaService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
    public List<DisciplinaDTO> listar(@RequestParam(required = false) Long professorId, @RequestParam(required = false) String semestre) {
        return disciplinaService.listar(professorId, semestre);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ALUNO','PROFESSOR','TUTOR','GESTOR')")
    public DisciplinaDTO buscar(@PathVariable Long id) {
        return disciplinaService.buscar(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('GESTOR')")
    public DisciplinaDTO criar(@Valid @RequestBody DisciplinaDTO dto) {
        return disciplinaService.criar(dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public DisciplinaDTO atualizar(@PathVariable Long id, @Valid @RequestBody DisciplinaDTO dto) {
        return disciplinaService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GESTOR')")
    public void remover(@PathVariable Long id) {
        disciplinaService.remover(id);
    }
}
