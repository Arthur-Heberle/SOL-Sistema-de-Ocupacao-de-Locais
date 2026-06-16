package br.edu.utfpr.sol.service;

import br.edu.utfpr.sol.dto.SalaDTO;
import br.edu.utfpr.sol.entity.Sala;
import br.edu.utfpr.sol.entity.enums.TipoSala;
import br.edu.utfpr.sol.exception.BusinessRuleException;
import br.edu.utfpr.sol.exception.NotFoundException;
import br.edu.utfpr.sol.mapper.SolMapper;
import br.edu.utfpr.sol.repository.SalaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SalaService {
    private final SalaRepository salaRepository;
    private final SolMapper mapper;

    public SalaService(SalaRepository salaRepository, SolMapper mapper) {
        this.salaRepository = salaRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<SalaDTO> listar(String bloco, TipoSala tipoSala, Boolean permiteReserva) {
        return salaRepository.findByAtivoTrue().stream()
            .filter(s -> bloco == null || s.getBloco().equalsIgnoreCase(bloco))
            .filter(s -> tipoSala == null || s.getTipoSala() == tipoSala)
            .filter(s -> permiteReserva == null || s.isPermiteReserva() == permiteReserva)
            .map(mapper::toDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public SalaDTO buscar(Long id) {
        return mapper.toDto(require(id));
    }

    @Transactional
    public SalaDTO criar(SalaDTO dto) {
        if (salaRepository.existsByCodigoNomeIgnoreCase(dto.codigoNome())) {
            throw new BusinessRuleException("Código de sala já cadastrado.");
        }
        Sala sala = new Sala();
        apply(dto, sala);
        return mapper.toDto(salaRepository.save(sala));
    }

    @Transactional
    public SalaDTO atualizar(Long id, SalaDTO dto) {
        Sala sala = require(id);
        apply(dto, sala);
        return mapper.toDto(sala);
    }

    @Transactional
    public void remover(Long id) {
        Sala sala = require(id);
        sala.setAtivo(false);
        sala.setPermiteReserva(false);
    }

    private void apply(SalaDTO dto, Sala sala) {
        sala.setBloco(dto.bloco().trim().toUpperCase());
        sala.setCodigoNome(dto.codigoNome().trim().toUpperCase());
        sala.setTipoSala(dto.tipoSala());
        sala.setCapacidade(dto.capacidade());
        sala.setPossuiProjetor(Boolean.TRUE.equals(dto.possuiProjetor()));
        sala.setPermiteReserva(dto.tipoSala() != TipoSala.DEPARTAMENTO && !Boolean.FALSE.equals(dto.permiteReserva()));
        sala.setDescricao(dto.descricao());
    }

    public Sala require(Long id) {
        return salaRepository.findById(id)
            .filter(Sala::isAtivo)
            .orElseThrow(() -> new NotFoundException("Sala não encontrada."));
    }
}
