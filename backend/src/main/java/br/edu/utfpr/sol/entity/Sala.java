package br.edu.utfpr.sol.entity;

import br.edu.utfpr.sol.entity.enums.TipoSala;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "salas")
public class Sala extends BaseEntity {
    @Column(nullable = false, length = 10)
    private String bloco;

    @Column(name = "codigo_nome", nullable = false, unique = true, length = 20)
    private String codigoNome;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_sala", nullable = false, length = 20)
    private TipoSala tipoSala;

    @Column(nullable = false)
    private Integer capacidade;

    @Column(name = "possui_projetor", nullable = false)
    private boolean possuiProjetor;

    @Column(name = "permite_reserva", nullable = false)
    private boolean permiteReserva = true;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false)
    private boolean ativo = true;

    public String getBloco() {
        return bloco;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }

    public String getCodigoNome() {
        return codigoNome;
    }

    public void setCodigoNome(String codigoNome) {
        this.codigoNome = codigoNome;
    }

    public TipoSala getTipoSala() {
        return tipoSala;
    }

    public void setTipoSala(TipoSala tipoSala) {
        this.tipoSala = tipoSala;
    }

    public Integer getCapacidade() {
        return capacidade;
    }

    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }

    public boolean isPossuiProjetor() {
        return possuiProjetor;
    }

    public void setPossuiProjetor(boolean possuiProjetor) {
        this.possuiProjetor = possuiProjetor;
    }

    public boolean isPermiteReserva() {
        return permiteReserva;
    }

    public void setPermiteReserva(boolean permiteReserva) {
        this.permiteReserva = permiteReserva;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
