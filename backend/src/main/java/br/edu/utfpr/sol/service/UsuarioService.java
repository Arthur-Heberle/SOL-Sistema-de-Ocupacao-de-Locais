package br.edu.utfpr.sol.service;

import br.edu.utfpr.sol.dto.UsuarioDTO;
import br.edu.utfpr.sol.dto.UsuarioRequestDTO;
import br.edu.utfpr.sol.entity.Usuario;
import br.edu.utfpr.sol.entity.enums.TipoUsuario;
import br.edu.utfpr.sol.exception.BusinessRuleException;
import br.edu.utfpr.sol.exception.NotFoundException;
import br.edu.utfpr.sol.mapper.SolMapper;
import br.edu.utfpr.sol.repository.UsuarioRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {
    private static final String DEFAULT_PASSWORD = "123456";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SolMapper mapper;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, SolMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listar(TipoUsuario tipoUsuario, Boolean ativo) {
        return usuarioRepository.findAll().stream()
            .filter(u -> tipoUsuario == null || u.getTipoUsuario() == tipoUsuario)
            .filter(u -> ativo == null || u.isAtivo() == ativo)
            .map(mapper::toDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDTO buscar(Long id) {
        return mapper.toDto(require(id));
    }

    @Transactional
    public UsuarioDTO criar(UsuarioRequestDTO dto) {
        if (usuarioRepository.existsByEmailIgnoreCase(dto.email())) {
            throw new BusinessRuleException("E-mail já cadastrado.");
        }
        Usuario usuario = new Usuario();
        apply(dto, usuario);
        usuario.setSenhaHash(passwordEncoder.encode(dto.senha() == null || dto.senha().isBlank() ? DEFAULT_PASSWORD : dto.senha()));
        return mapper.toDto(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioDTO atualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = require(id);
        usuarioRepository.findByEmailIgnoreCase(dto.email())
            .filter(existing -> !existing.getId().equals(id))
            .ifPresent(existing -> {
                throw new BusinessRuleException("E-mail já cadastrado.");
            });
        apply(dto, usuario);
        if (dto.senha() != null && !dto.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(dto.senha()));
        }
        return mapper.toDto(usuario);
    }

    @Transactional
    public UsuarioDTO ativar(Long id) {
        Usuario usuario = require(id);
        usuario.setAtivo(true);
        return mapper.toDto(usuario);
    }

    @Transactional
    public UsuarioDTO inativar(Long id) {
        Usuario usuario = require(id);
        usuario.setAtivo(false);
        return mapper.toDto(usuario);
    }

    private void apply(UsuarioRequestDTO dto, Usuario usuario) {
        usuario.setNome(dto.nome().trim());
        usuario.setEmail(dto.email().trim().toLowerCase());
        usuario.setTipoUsuario(dto.tipoUsuario());
        usuario.setAtivo(dto.ativo() == null || dto.ativo());
    }

    public Usuario require(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Usuário não encontrado."));
    }
}
