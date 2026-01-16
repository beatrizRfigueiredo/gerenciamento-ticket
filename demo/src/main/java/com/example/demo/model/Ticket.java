package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;
    private String nomeCliente;
    private String prioridade;
    private String status = "ABERTO";
    private LocalDateTime dataCriacao = LocalDateTime.now();

    public Ticket() {}

    public Long getId() {
    return id;
    }
    public void setId(Long id) {
    this.id = id;
    }

    public String getTitulo() {
    return titulo;
    }
    public void setTitulo(String titulo) {
    this.titulo = titulo;
    }

    public String getDescricao() {
    return descricao;
    }
    public void setDescricao(String descricao) {
    this.descricao = descricao;
    }

    public String getPrioridade() {
    return prioridade;
    }
    public void setPrioridade(String prioridade) {
    this.prioridade = prioridade;
    }

    public String getStatus() {
    return status;
    }
    public void setStatus(String status) {
    this.status = status;
    }

    public LocalDateTime getDataCriacao() {
    return dataCriacao;
    }
    public void setDataCriacao(LocalDateTime dataCriacao) {
    this.dataCriacao = dataCriacao;
    }

    public String getNomeCliente() {
        return nomeCliente;
    }
    public void setNomeCliente(String nomeCliente) {
        this.nomeCliente = nomeCliente;
    }

}