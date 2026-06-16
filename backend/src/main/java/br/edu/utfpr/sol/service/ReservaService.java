package br.edu.utfpr.sol.service;

import br.edu.utfpr.sol.dto.ReservaDTO;
import br.edu.utfpr.sol.entity.Disciplina;
import br.edu.utfpr.sol.entity.Projeto;
import br.edu.utfpr.sol.entity.Reserva;
import br.edu.utfpr.sol.entity.Sala;
import br.edu.utfpr.sol.entity.Usuario;
import br.edu.utfpr.sol.entity.enums.StatusReserva;
import br.edu.utfpr.sol.entity.enums.TipoSala;
import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import br.edu.utfpr.sol.entity.enums.Visibilidade;
import br.edu.utfpr.sol.exception.BusinessRuleException;
import br.edu.utfpr.sol.exception.ConflictException;
import br.edu.utfpr.sol.exception.ForbiddenException;
import br.edu.utfpr.sol.exception.NotFoundException;
import br.edu.utfpr.sol.mapper.SolMapper;
import br.edu.utfpr.sol.repository.ProjetoRepository;
import br.edu.utfpr.sol.repository.ReservaRepository;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReservaService {
    private final ReservaRepository reservaRepository;
    private final SalaService salaService;
    private final UsuarioService usuarioService;
    private final ProjetoService projetoService;
    private final ProjetoRepository projetoRepository;
    private final DisciplinaService disciplinaService;
    private final SolMapper mapper;

    public ReservaService(
        ReservaRepository reservaRepository,
        SalaService salaService,
        UsuarioService usuarioService,
        ProjetoService projetoService,
        ProjetoRepository projetoRepository,
        DisciplinaService disciplinaService,
        SolMapper mapper
    ) {
        this.reservaRepository = reservaRepository;
        this.salaService = salaService;
        this.usuarioService = usuarioService;
        this.projetoService = projetoService;
        this.projetoRepository = projetoRepository;
        this.disciplinaService = disciplinaService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> listar(
        Long salaId,
        Long usuarioId,
        Long projetoId,
        Long disciplinaId,
        StatusReserva status,
        LocalDateTime inicio,
        LocalDateTime fim,
        Usuario currentUser
    ) {
        return reservaRepository.findAll().stream()
            .filter(r -> salaId == null || r.getSala().getId().equals(salaId))
            .filter(r -> usuarioId == null || r.getUsuario().getId().equals(usuarioId))
            .filter(r -> projetoId == null || (r.getProjeto() != null && r.getProjeto().getId().equals(projetoId)))
            .filter(r -> disciplinaId == null || (r.getDisciplina() != null && r.getDisciplina().getId().equals(disciplinaId)))
            .filter(r -> status == null || r.getStatus() == status)
            .filter(r -> inicio == null || r.getDataFim().isAfter(inicio))
            .filter(r -> fim == null || r.getDataInicio().isBefore(fim))
            .map(r -> canSeePrivateDetails(r, currentUser) ? mapper.toDto(r) : mapper.toSanitizedDto(r))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> pendentes(Usuario currentUser) {
        return reservaRepository.findByStatus(StatusReserva.PENDENTE).stream()
            .filter(r -> currentUser.getTipoUsuario() == TipoUsuario.GESTOR || r.getUsuario().getId().equals(currentUser.getId()))
            .map(r -> canSeePrivateDetails(r, currentUser) ? mapper.toDto(r) : mapper.toSanitizedDto(r))
            .toList();
    }

    @Transactional(readOnly = true)
    public ReservaDTO buscar(Long id, Usuario currentUser) {
        Reserva reserva = require(id);
        return canSeePrivateDetails(reserva, currentUser) ? mapper.toDto(reserva) : mapper.toSanitizedDto(reserva);
    }

    @Transactional
    public ReservaDTO criar(ReservaDTO dto, Usuario currentUser) {
        if (currentUser.getTipoUsuario() == TipoUsuario.ALUNO) {
            throw new ForbiddenException("Alunos possuem acesso somente para visualização.");
        }
        validateRange(dto.dataInicio(), dto.dataFim());
        Sala sala = salaService.require(dto.idSala());
        validateRoomCanBeReserved(sala);
        if (hasConflict(sala.getId(), dto.dataInicio(), dto.dataFim(), dto.recorrente(), null)) {
            throw new ConflictException("Sala não está mais disponível no horário solicitado.");
        }

        Reserva reserva = new Reserva();
        reserva.setSala(sala);
        reserva.setUsuario(resolveCreator(dto, currentUser));
        reserva.setProjeto(resolveProjeto(dto.idProjeto(), sala));
        reserva.setDisciplina(resolveDisciplina(dto.idDisciplina()));
        reserva.setTitulo(dto.titulo().trim());
        reserva.setDescricao(dto.descricao());
        reserva.setVisibilidade(dto.visibilidade());
        reserva.setDataInicio(dto.dataInicio());
        reserva.setDataFim(dto.dataFim());
        reserva.setRecorrente(dto.recorrente());
        reserva.setStatus(initialStatus(reserva, currentUser));
        return mapper.toDto(reservaRepository.save(reserva));
    }

    @Transactional
    public ReservaDTO aprovar(Long id) {
        Reserva reserva = require(id);
        if (reserva.getStatus() != StatusReserva.PENDENTE) {
            throw new BusinessRuleException("Apenas reservas pendentes podem ser aprovadas.");
        }
        if (hasConflict(reserva.getSala().getId(), reserva.getDataInicio(), reserva.getDataFim(), reserva.isRecorrente(), reserva.getId())) {
            throw new ConflictException("Conflito detectado com outra reserva aprovada.");
        }
        reserva.setStatus(StatusReserva.APROVADA);
        return mapper.toDto(reserva);
    }

    @Transactional
    public ReservaDTO rejeitar(Long id) {
        Reserva reserva = require(id);
        if (reserva.getStatus() != StatusReserva.PENDENTE) {
            throw new BusinessRuleException("Apenas reservas pendentes podem ser rejeitadas.");
        }
        reserva.setStatus(StatusReserva.REJEITADA);
        return mapper.toDto(reserva);
    }

    @Transactional
    public ReservaDTO cancelar(Long id, Usuario currentUser) {
        Reserva reserva = require(id);
        if (currentUser.getTipoUsuario() != TipoUsuario.GESTOR && !reserva.getUsuario().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Usuário não pode cancelar esta reserva.");
        }
        if (!reserva.getDataInicio().isAfter(LocalDateTime.now())) {
            throw new BusinessRuleException("Apenas reservas futuras podem ser canceladas.");
        }
        reserva.setStatus(StatusReserva.CANCELADA);
        return mapper.toDto(reserva);
    }

    public Reserva require(Long id) {
        return reservaRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Reserva não encontrada."));
    }

    boolean hasConflict(Long salaId, LocalDateTime inicio, LocalDateTime fim, boolean recorrente, Long ignoredReservaId) {
        return reservaRepository.findBySalaIdAndStatus(salaId, StatusReserva.APROVADA).stream()
            .filter(existing -> ignoredReservaId == null || !existing.getId().equals(ignoredReservaId))
            .anyMatch(existing -> conflicts(existing, inicio, fim, recorrente));
    }

    private boolean conflicts(Reserva existing, LocalDateTime inicio, LocalDateTime fim, boolean recorrente) {
        if (!existing.isRecorrente() && !recorrente) {
            return inicio.isBefore(existing.getDataFim()) && fim.isAfter(existing.getDataInicio());
        }
        if (existing.getDataInicio().getDayOfWeek() != inicio.getDayOfWeek()) {
            return false;
        }
        LocalTime start = inicio.toLocalTime();
        LocalTime end = fim.toLocalTime();
        LocalTime existingStart = existing.getDataInicio().toLocalTime();
        LocalTime existingEnd = existing.getDataFim().toLocalTime();
        return start.isBefore(existingEnd) && end.isAfter(existingStart);
    }

    private void validateRange(LocalDateTime inicio, LocalDateTime fim) {
        if (!inicio.isBefore(fim)) {
            throw new BusinessRuleException("Data/hora de fim deve ser após o início.");
        }
    }

    private void validateRoomCanBeReserved(Sala sala) {
        if (!sala.isPermiteReserva() || sala.getTipoSala() == TipoSala.DEPARTAMENTO) {
            throw new BusinessRuleException("Sala não permite reservas.");
        }
    }

    private Usuario resolveCreator(ReservaDTO dto, Usuario currentUser) {
        if (dto.idUsuario() != null && !dto.idUsuario().equals(currentUser.getId()) && currentUser.getTipoUsuario() == TipoUsuario.GESTOR) {
            return usuarioService.require(dto.idUsuario());
        }
        return currentUser;
    }

    private Projeto resolveProjeto(Long idProjeto, Sala sala) {
        if (idProjeto != null) {
            return projetoService.require(idProjeto);
        }
        if (sala.getTipoSala() == TipoSala.PROJETO) {
            return projetoRepository.findBySalaExclusivaId(sala.getId()).orElse(null);
        }
        return null;
    }

    private Disciplina resolveDisciplina(Long idDisciplina) {
        return idDisciplina == null ? null : disciplinaService.require(idDisciplina);
    }

    private StatusReserva initialStatus(Reserva reserva, Usuario currentUser) {
        if (reserva.getSala().getTipoSala() == TipoSala.PROJETO) {
            if (reserva.getProjeto() != null
                && reserva.getProjeto().isAprovado()
                && projetoService.isMember(reserva.getProjeto().getId(), currentUser.getId())) {
                return StatusReserva.APROVADA;
            }
            return StatusReserva.PENDENTE;
        }
        if (reserva.isRecorrente()) {
            return StatusReserva.PENDENTE;
        }
        return StatusReserva.APROVADA;
    }

    private boolean canSeePrivateDetails(Reserva reserva, Usuario currentUser) {
        return reserva.getVisibilidade() == Visibilidade.PUBLICA
            || currentUser.getTipoUsuario() == TipoUsuario.GESTOR
            || reserva.getUsuario().getId().equals(currentUser.getId());
    }
}
