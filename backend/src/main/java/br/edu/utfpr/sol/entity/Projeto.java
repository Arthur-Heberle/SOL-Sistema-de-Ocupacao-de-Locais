package br.edu.utfpr.sol.entity;

import br.edu.utfpr.sol.entity.enums.CategoriaProj;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "projetos")
public class Projeto extends BaseEntity {
    @Column(nullable = false, length = 80)
    private String nome;

    @Column(nullable = false, length = 1500)
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CategoriaProj categoria;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tutor_id", nullable = false)
    private Usuario tutor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sala_exclusiva_id")
    private Sala salaExclusiva;

    @Column(nullable = false)
    private boolean aprovado;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public CategoriaProj getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaProj categoria) {
        this.categoria = categoria;
    }

    public Usuario getTutor() {
        return tutor;
    }

    public void setTutor(Usuario tutor) {
        this.tutor = tutor;
    }

    public Sala getSalaExclusiva() {
        return salaExclusiva;
    }

    public void setSalaExclusiva(Sala salaExclusiva) {
        this.salaExclusiva = salaExclusiva;
    }

    public boolean isAprovado() {
        return aprovado;
    }

    public void setAprovado(boolean aprovado) {
        this.aprovado = aprovado;
    }
}
