package br.edu.utfpr.sol.service;

import br.edu.utfpr.sol.dto.DisponibilidadeDTO;
import br.edu.utfpr.sol.dto.HorarioDTO;
import br.edu.utfpr.sol.entity.Disponibilidade;
import br.edu.utfpr.sol.entity.Projeto;
import br.edu.utfpr.sol.entity.Usuario;
import br.edu.utfpr.sol.entity.enums.DiaSemana;
import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import br.edu.utfpr.sol.exception.BusinessRuleException;
import br.edu.utfpr.sol.mapper.SolMapper;
import br.edu.utfpr.sol.repository.DisponibilidadeRepository;
import br.edu.utfpr.sol.repository.MembroProjetoRepository;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisponibilidadeService {
    private final DisponibilidadeRepository disponibilidadeRepository;
    private final MembroProjetoRepository membroRepository;
    private final ProjetoService projetoService;
    private final UsuarioService usuarioService;

    public DisponibilidadeService(
        DisponibilidadeRepository disponibilidadeRepository,
        MembroProjetoRepository membroRepository,
        ProjetoService projetoService,
        UsuarioService usuarioService,
        SolMapper mapper
    ) {
        this.disponibilidadeRepository = disponibilidadeRepository;
        this.membroRepository = membroRepository;
        this.projetoService = projetoService;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public DisponibilidadeDTO salvar(Long projetoId, DisponibilidadeDTO dto, Usuario currentUser) {
        Projeto projeto = projetoService.require(projetoId);
        projetoService.requireProjectAccess(projeto, currentUser);
        Long usuarioId = dto.idUsuario() == null ? currentUser.getId() : dto.idUsuario();
        if (!currentUser.getId().equals(usuarioId) && currentUser.getTipoUsuario() != TipoUsuario.GESTOR) {
            throw new BusinessRuleException("Usuário só pode editar a própria disponibilidade.");
        }
        if (!projetoService.isMember(projetoId, usuarioId) && currentUser.getTipoUsuario() != TipoUsuario.GESTOR) {
            throw new BusinessRuleException("Usuário deve ser membro do projeto.");
        }
        dto.matrizHorarios().forEach(this::validateHorario);
        var usuario = usuarioService.require(usuarioId);
        disponibilidadeRepository.deleteByProjetoIdAndUsuarioId(projetoId, usuarioId);
        dto.matrizHorarios().forEach(horario -> {
            Disponibilidade disponibilidade = new Disponibilidade();
            disponibilidade.setProjeto(projeto);
            disponibilidade.setUsuario(usuario);
            disponibilidade.setDiaSemana(horario.diaSemana());
            disponibilidade.setHoraInicio(horario.horaInicio());
            disponibilidade.setHoraFim(horario.horaFim());
            disponibilidadeRepository.save(disponibilidade);
        });
        return new DisponibilidadeDTO(usuarioId, projetoId, dto.matrizHorarios());
    }

    @Transactional(readOnly = true)
    public List<DisponibilidadeDTO> listar(Long projetoId, Usuario currentUser) {
        Projeto projeto = projetoService.require(projetoId);
        projetoService.requireProjectAccess(projeto, currentUser);
        Map<Long, List<HorarioDTO>> grouped = new java.util.LinkedHashMap<>();
        disponibilidadeRepository.findByProjetoId(projetoId).forEach(d ->
            grouped.computeIfAbsent(d.getUsuario().getId(), key -> new ArrayList<>())
                .add(new HorarioDTO(d.getDiaSemana(), d.getHoraInicio(), d.getHoraFim()))
        );
        return grouped.entrySet().stream()
            .map(entry -> new DisponibilidadeDTO(entry.getKey(), projetoId, entry.getValue()))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<HorarioDTO> intersecao(Long projetoId, Usuario currentUser) {
        Projeto projeto = projetoService.require(projetoId);
        projetoService.requireProjectAccess(projeto, currentUser);
        List<Long> memberIds = membroRepository.findByProjetoId(projetoId).stream()
            .map(m -> m.getUsuario().getId())
            .toList();
        if (memberIds.isEmpty()) {
            return List.of();
        }

        Map<Long, List<Disponibilidade>> byUser = new java.util.LinkedHashMap<>();
        disponibilidadeRepository.findByProjetoId(projetoId).forEach(d ->
            byUser.computeIfAbsent(d.getUsuario().getId(), key -> new ArrayList<>()).add(d)
        );
        if (!byUser.keySet().containsAll(memberIds)) {
            return List.of();
        }

        List<Interval> current = byUser.get(memberIds.get(0)).stream()
            .map(d -> new Interval(d.getDiaSemana(), d.getHoraInicio(), d.getHoraFim()))
            .toList();
        for (int i = 1; i < memberIds.size(); i++) {
            current = intersect(current, byUser.get(memberIds.get(i)).stream()
                .map(d -> new Interval(d.getDiaSemana(), d.getHoraInicio(), d.getHoraFim()))
                .toList());
        }
        return current.stream()
            .sorted(Comparator.comparing(Interval::dia).thenComparing(Interval::start))
            .map(i -> new HorarioDTO(i.dia(), i.start(), i.end()))
            .toList();
    }

    private List<Interval> intersect(List<Interval> left, List<Interval> right) {
        List<Interval> result = new ArrayList<>();
        for (Interval a : left) {
            for (Interval b : right) {
                if (a.dia() == b.dia() && a.start().isBefore(b.end()) && a.end().isAfter(b.start())) {
                    LocalTime start = a.start().isAfter(b.start()) ? a.start() : b.start();
                    LocalTime end = a.end().isBefore(b.end()) ? a.end() : b.end();
                    if (start.isBefore(end)) {
                        result.add(new Interval(a.dia(), start, end));
                    }
                }
            }
        }
        return merge(result);
    }

    private List<Interval> merge(List<Interval> intervals) {
        Map<DiaSemana, List<Interval>> byDay = new EnumMap<>(DiaSemana.class);
        intervals.forEach(i -> byDay.computeIfAbsent(i.dia(), key -> new ArrayList<>()).add(i));
        List<Interval> merged = new ArrayList<>();
        byDay.forEach((day, values) -> {
            values.sort(Comparator.comparing(Interval::start));
            for (Interval value : values) {
                if (merged.isEmpty()) {
                    merged.add(value);
                    continue;
                }
                Interval last = merged.get(merged.size() - 1);
                if (last.dia() == value.dia() && !value.start().isAfter(last.end())) {
                    merged.set(merged.size() - 1, new Interval(day, last.start(), last.end().isAfter(value.end()) ? last.end() : value.end()));
                } else {
                    merged.add(value);
                }
            }
        });
        return merged;
    }

    private void validateHorario(HorarioDTO horario) {
        if (!horario.horaInicio().isBefore(horario.horaFim())) {
            throw new BusinessRuleException("Horário de fim deve ser após o início.");
        }
    }

    private record Interval(DiaSemana dia, LocalTime start, LocalTime end) {
    }
}
