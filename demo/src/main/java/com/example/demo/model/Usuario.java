package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String cpf;
    private String senha;
    private String tipo;

    public Long getId() {
    return id;
    }
    public void setId(Long id) {
    this.id = id;
    }

    public String getNome() {
    return nome;
    }
    public void setNome(String nome) {
    this.nome = nome;
    }

    public String getCpf() {
    return cpf;
    }
    public void setCpf(String cpf) {
    this.cpf = cpf;
    }

    public String getSenha() {
    return senha;
    }
    public void setSenha(String senha) {
    this.senha = senha;
    }

    public String getTipo() {
    return tipo;
    }
    public void setTipo(String tipo) {
    this.tipo = tipo;
    }
}