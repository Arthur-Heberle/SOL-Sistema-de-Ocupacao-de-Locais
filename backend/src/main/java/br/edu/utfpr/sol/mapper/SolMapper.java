package br.edu.utfpr.sol.mapper;

import br.edu.utfpr.sol.dto.DisciplinaDTO;
import br.edu.utfpr.sol.dto.MembroProjetoDTO;
import br.edu.utfpr.sol.dto.ProjetoDTO;
import br.edu.utfpr.sol.dto.ReservaDTO;
import br.edu.utfpr.sol.dto.SalaDTO;
import br.edu.utfpr.sol.dto.UsuarioDTO;
import br.edu.utfpr.sol.entity.Disciplina;
import br.edu.utfpr.sol.entity.MembroProjeto;
import br.edu.utfpr.sol.entity.Projeto;
import br.edu.utfpr.sol.entity.Reserva;
import br.edu.utfpr.sol.entity.Sala;
import br.edu.utfpr.sol.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class SolMapper {
    public UsuarioDTO toDto(Usuario usuario) {
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getTipoUsuario(),
            usuario.isAtivo()
        );
    }

    public SalaDTO toDto(Sala sala) {
        return new SalaDTO(
            sala.getId(),
            sala.getBloco(),
            sala.getCodigoNome(),
            sala.getTipoSala(),
            sala.getCapacidade(),
            sala.isPossuiProjetor(),
            sala.isPermiteReserva(),
            sala.getDescricao()
        );
    }

    public ReservaDTO toDto(Reserva reserva) {
        return new ReservaDTO(
            reserva.getId(),
            reserva.getSala().getId(),
            reserva.getUsuario().getId(),
            reserva.getProjeto() == null ? null : reserva.getProjeto().getId(),
            reserva.getDisciplina() == null ? null : reserva.getDisciplina().getId(),
            reserva.getTitulo(),
            reserva.getDescricao(),
            reserva.getVisibilidade(),
            reserva.getDataInicio(),
            reserva.getDataFim(),
            reserva.isRecorrente(),
            reserva.getStatus()
        );
    }

    public ReservaDTO toSanitizedDto(Reserva reserva) {
        return new ReservaDTO(
            reserva.getId(),
            reserva.getSala().getId(),
            reserva.getUsuario().getId(),
            reserva.getProjeto() == null ? null : reserva.getProjeto().getId(),
            reserva.getDisciplina() == null ? null : reserva.getDisciplina().getId(),
            "Ocupado",
            null,
            reserva.getVisibilidade(),
            reserva.getDataInicio(),
            reserva.getDataFim(),
            reserva.isRecorrente(),
            reserva.getStatus()
        );
    }

    public ProjetoDTO toDto(Projeto projeto) {
        return new ProjetoDTO(
            projeto.getId(),
            projeto.getNome(),
            projeto.getDescricao(),
            projeto.getCategoria(),
            projeto.getTutor().getId(),
            projeto.getSalaExclusiva() == null ? null : projeto.getSalaExclusiva().getId(),
            projeto.isAprovado()
        );
    }

    public DisciplinaDTO toDto(Disciplina disciplina) {
        return new DisciplinaDTO(
            disciplina.getId(),
            disciplina.getCodigo(),
            disciplina.getNome(),
            disciplina.getSemestre(),
            disciplina.getProfessor().getId(),
            disciplina.getCargaHoraria(),
            disciplina.getTurma()
        );
    }

    public MembroProjetoDTO toDto(MembroProjeto membro) {
        return new MembroProjetoDTO(
            membro.getId(),
            membro.getUsuario().getId(),
            membro.getProjeto().getId(),
            membro.getUsuario().getNome(),
            membro.getUsuario().getEmail(),
            membro.isGestor(),
            membro.getDataIngresso()
        );
    }
}
