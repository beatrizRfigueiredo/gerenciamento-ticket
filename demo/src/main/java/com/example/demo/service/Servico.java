package com.example.demo.service;

import com.example.demo.model.Ticket;
import com.example.demo.repository.Repositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Servico {

    @Autowired
    private Repositorio repository;

    public List<Ticket> listarTodos() {
    return repository.findAll();
    }

    public Ticket criar(Ticket ticket) {
    ticket.setStatus("ABERTO");
    ticket.setDataCriacao(java.time.LocalDateTime.now());
    return repository.save(ticket);
    }

    public Ticket atualizar(Long id, Ticket dados) {
    Ticket ticketBanco = repository.findById(id).orElseThrow();

    if ("CONCLUIDO".equals(ticketBanco.getStatus())) {
    throw new RuntimeException("Ticket concluído, não pode ser alterado!");
    }
    ticketBanco.setTitulo(dados.getTitulo());
    ticketBanco.setDescricao(dados.getDescricao());
    ticketBanco.setPrioridade(dados.getPrioridade());
    ticketBanco.setStatus(dados.getStatus());
    return repository.save(ticketBanco);
    }

    public Ticket buscarPorId(Long id) {
    return repository.findById(id).orElseThrow(() -> new RuntimeException("Ticket não encontrado"));
    }

    public void excluir(Long id) {
    repository.deleteById(id);
    }
}