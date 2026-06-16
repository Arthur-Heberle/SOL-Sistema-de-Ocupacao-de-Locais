package br.edu.utfpr.sol.service;

import br.edu.utfpr.sol.dto.DisciplinaDTO;
import br.edu.utfpr.sol.entity.Disciplina;
import br.edu.utfpr.sol.entity.enums.StatusReserva;
import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import br.edu.utfpr.sol.exception.BusinessRuleException;
import br.edu.utfpr.sol.exception.NotFoundException;
import br.edu.utfpr.sol.mapper.SolMapper;
import br.edu.utfpr.sol.repository.DisciplinaRepository;
import br.edu.utfpr.sol.repository.ReservaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisciplinaService {
    private final DisciplinaRepository disciplinaRepository;
    private final ReservaRepository reservaRepository;
    private final UsuarioService usuarioService;
    private final SolMapper mapper;

    public DisciplinaService(
        DisciplinaRepository disciplinaRepository,
        ReservaRepository reservaRepository,
        UsuarioService usuarioService,
        SolMapper mapper
    ) {
        this.disciplinaRepository = disciplinaRepository;
        this.reservaRepository = reservaRepository;
        this.usuarioService = usuarioService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<DisciplinaDTO> listar(Long professorId, String semestre) {
        return disciplinaRepository.findAll().stream()
            .filter(d -> professorId == null || d.getProfessor().getId().equals(professorId))
            .filter(d -> semestre == null || d.getSemestre().equals(semestre))
            .map(mapper::toDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public DisciplinaDTO buscar(Long id) {
        return mapper.toDto(require(id));
    }

    @Transactional
    public DisciplinaDTO criar(DisciplinaDTO dto) {
        Disciplina disciplina = new Disciplina();
        apply(dto, disciplina);
        return mapper.toDto(disciplinaRepository.save(disciplina));
    }

    @Transactional
    public DisciplinaDTO atualizar(Long id, DisciplinaDTO dto) {
        Disciplina disciplina = require(id);
        apply(dto, disciplina);
        return mapper.toDto(disciplina);
    }

    @Transactional
    public void remover(Long id) {
        if (reservaRepository.existsByDisciplinaIdAndStatus(id, StatusReserva.APROVADA)) {
            throw new BusinessRuleException("Não é possível remover disciplina com reservas aprovadas.");
        }
        disciplinaRepository.delete(require(id));
    }

    private void apply(DisciplinaDTO dto, Disciplina disciplina) {
        var professor = usuarioService.require(dto.idProfessor());
        if (professor.getTipoUsuario() != TipoUsuario.PROFESSOR && professor.getTipoUsuario() != TipoUsuario.GESTOR) {
            throw new BusinessRuleException("Professor da disciplina deve ter papel PROFESSOR ou GESTOR.");
        }
        disciplina.setCodigo(dto.codigo().trim().toUpperCase());
        disciplina.setNome(dto.nome().trim());
        disciplina.setSemestre(dto.semestre());
        disciplina.setProfessor(professor);
        disciplina.setCargaHoraria(dto.cargaHoraria());
        disciplina.setTurma(dto.turma().trim().toUpperCase());
    }

    public Disciplina require(Long id) {
        return disciplinaRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Disciplina não encontrada."));
    }
}
