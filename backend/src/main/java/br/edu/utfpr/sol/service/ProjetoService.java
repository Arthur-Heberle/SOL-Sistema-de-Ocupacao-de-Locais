package br.edu.utfpr.sol.service;

import br.edu.utfpr.sol.dto.MembroProjetoDTO;
import br.edu.utfpr.sol.dto.ProjetoDTO;
import br.edu.utfpr.sol.entity.MembroProjeto;
import br.edu.utfpr.sol.entity.Projeto;
import br.edu.utfpr.sol.entity.Usuario;
import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import br.edu.utfpr.sol.exception.BusinessRuleException;
import br.edu.utfpr.sol.exception.ForbiddenException;
import br.edu.utfpr.sol.exception.NotFoundException;
import br.edu.utfpr.sol.mapper.SolMapper;
import br.edu.utfpr.sol.repository.MembroProjetoRepository;
import br.edu.utfpr.sol.repository.ProjetoRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjetoService {
    private final ProjetoRepository projetoRepository;
    private final MembroProjetoRepository membroRepository;
    private final UsuarioService usuarioService;
    private final SalaService salaService;
    private final SolMapper mapper;

    public ProjetoService(
        ProjetoRepository projetoRepository,
        MembroProjetoRepository membroRepository,
        UsuarioService usuarioService,
        SalaService salaService,
        SolMapper mapper
    ) {
        this.projetoRepository = projetoRepository;
        this.membroRepository = membroRepository;
        this.usuarioService = usuarioService;
        this.salaService = salaService;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ProjetoDTO> listar(Boolean aprovado, Long tutorId) {
        return projetoRepository.findAll().stream()
            .filter(p -> aprovado == null || p.isAprovado() == aprovado)
            .filter(p -> tutorId == null || p.getTutor().getId().equals(tutorId))
            .map(mapper::toDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProjetoDTO buscar(Long id) {
        return mapper.toDto(require(id));
    }

    @Transactional
    public ProjetoDTO criar(ProjetoDTO dto, Usuario currentUser) {
        if (!isGestor(currentUser) && currentUser.getTipoUsuario() != TipoUsuario.PROFESSOR && currentUser.getTipoUsuario() != TipoUsuario.TUTOR) {
            throw new ForbiddenException("Usuário não pode registrar projetos.");
        }
        Usuario tutor = dto.idTutor() == null ? currentUser : usuarioService.require(dto.idTutor());
        Projeto projeto = new Projeto();
        projeto.setNome(dto.nome().trim());
        projeto.setDescricao(dto.descricao().trim());
        projeto.setCategoria(dto.categoria());
        projeto.setTutor(tutor);
        if (dto.idSalaExclusiva() != null) {
            projeto.setSalaExclusiva(salaService.require(dto.idSalaExclusiva()));
        }
        projeto.setAprovado(isGestor(currentUser) && Boolean.TRUE.equals(dto.aprovado()));
        Projeto saved = projetoRepository.save(projeto);
        if (!membroRepository.existsByProjetoIdAndUsuarioId(saved.getId(), tutor.getId())) {
            addMemberInternal(saved, tutor, true);
        }
        return mapper.toDto(saved);
    }

    @Transactional
    public ProjetoDTO aprovar(Long id) {
        Projeto projeto = require(id);
        projeto.setAprovado(true);
        return mapper.toDto(projeto);
    }

    @Transactional
    public ProjetoDTO rejeitar(Long id) {
        Projeto projeto = require(id);
        projeto.setAprovado(false);
        return mapper.toDto(projeto);
    }

    @Transactional
    public ProjetoDTO atualizar(Long id, ProjetoDTO dto, Usuario currentUser) {
        Projeto projeto = require(id);
        if (!isGestor(currentUser) && !projeto.getTutor().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Usuário não pode editar este projeto.");
        }
        projeto.setNome(dto.nome().trim());
        projeto.setDescricao(dto.descricao().trim());
        projeto.setCategoria(dto.categoria());
        if (dto.idSalaExclusiva() != null) {
            projeto.setSalaExclusiva(salaService.require(dto.idSalaExclusiva()));
        } else {
            projeto.setSalaExclusiva(null);
        }
        if (isGestor(currentUser) && dto.aprovado() != null) {
            projeto.setAprovado(dto.aprovado());
        }
        return mapper.toDto(projeto);
    }

    @Transactional(readOnly = true)
    public List<MembroProjetoDTO> listarMembros(Long projetoId, Usuario currentUser) {
        Projeto projeto = require(projetoId);
        requireProjectAccess(projeto, currentUser);
        return membroRepository.findByProjetoId(projetoId).stream().map(mapper::toDto).toList();
    }

    @Transactional
    public MembroProjetoDTO adicionarMembro(Long projetoId, MembroProjetoDTO dto, Usuario currentUser) {
        Projeto projeto = require(projetoId);
        requireProjectManager(projeto, currentUser);
        Usuario usuario = usuarioService.require(dto.idUsuario());
        if (membroRepository.existsByProjetoIdAndUsuarioId(projetoId, usuario.getId())) {
            throw new BusinessRuleException("Usuário já é membro do projeto.");
        }
        return mapper.toDto(addMemberInternal(projeto, usuario, dto.isGestor()));
    }

    @Transactional
    public void removerMembro(Long projetoId, Long usuarioId, Usuario currentUser) {
        Projeto projeto = require(projetoId);
        requireProjectManager(projeto, currentUser);
        MembroProjeto membro = membroRepository.findByProjetoIdAndUsuarioId(projetoId, usuarioId)
            .orElseThrow(() -> new NotFoundException("Membro do projeto não encontrado."));
        if (membro.isGestor() && countProjectManagers(projetoId) <= 1) {
            throw new BusinessRuleException("Não é possível remover o único gestor do projeto.");
        }
        membroRepository.delete(membro);
    }

    @Transactional
    public MembroProjetoDTO alterarGestor(Long projetoId, Long usuarioId, boolean gestor, Usuario currentUser) {
        Projeto projeto = require(projetoId);
        if (!isGestor(currentUser) && !projeto.getTutor().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("Usuário não pode alterar gestores deste projeto.");
        }
        MembroProjeto membro = membroRepository.findByProjetoIdAndUsuarioId(projetoId, usuarioId)
            .orElseThrow(() -> new NotFoundException("Membro do projeto não encontrado."));
        if (!gestor && membro.isGestor() && countProjectManagers(projetoId) <= 1) {
            throw new BusinessRuleException("O projeto precisa manter ao menos um gestor.");
        }
        membro.setGestor(gestor);
        return mapper.toDto(membro);
    }

    public boolean isMember(Long projetoId, Long usuarioId) {
        return membroRepository.existsByProjetoIdAndUsuarioId(projetoId, usuarioId);
    }

    public boolean isManager(Long projetoId, Long usuarioId) {
        return membroRepository.findByProjetoIdAndUsuarioId(projetoId, usuarioId)
            .map(MembroProjeto::isGestor)
            .orElse(false);
    }

    public Projeto require(Long id) {
        return projetoRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Projeto não encontrado."));
    }

    private MembroProjeto addMemberInternal(Projeto projeto, Usuario usuario, boolean gestor) {
        MembroProjeto membro = new MembroProjeto();
        membro.setProjeto(projeto);
        membro.setUsuario(usuario);
        membro.setDataIngresso(LocalDate.now());
        membro.setGestor(gestor);
        return membroRepository.save(membro);
    }

    public void requireProjectAccess(Projeto projeto, Usuario currentUser) {
        if (isGestor(currentUser) || projeto.getTutor().getId().equals(currentUser.getId()) || isMember(projeto.getId(), currentUser.getId())) {
            return;
        }
        throw new ForbiddenException("Usuário não tem acesso ao projeto.");
    }

    public void requireProjectManager(Projeto projeto, Usuario currentUser) {
        if (isGestor(currentUser) || projeto.getTutor().getId().equals(currentUser.getId()) || isManager(projeto.getId(), currentUser.getId())) {
            return;
        }
        throw new ForbiddenException("Usuário não pode gerenciar este projeto.");
    }

    private long countProjectManagers(Long projetoId) {
        return membroRepository.findByProjetoId(projetoId).stream().filter(MembroProjeto::isGestor).count();
    }

    private boolean isGestor(Usuario usuario) {
        return usuario.getTipoUsuario() == TipoUsuario.GESTOR;
    }
}
