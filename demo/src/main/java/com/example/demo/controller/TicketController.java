package com.example.demo.controller;

import com.example.demo.model.Ticket;
import com.example.demo.service.Servico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@CrossOrigin("*")
public class TicketController {

    @Autowired
    private Servico service;

    @GetMapping
    public List<Ticket> listar() {
    return service.listarTodos();
    }

    @PostMapping
    public Ticket criar(@RequestBody Ticket ticket) {
    return service.criar(ticket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Ticket ticket) {
    try{
    return ResponseEntity.ok(service.atualizar(id, ticket));
    } catch (RuntimeException e) {
    return ResponseEntity.badRequest().body(e.getMessage());
    }
    }

    @GetMapping("/{id}")
    public Ticket buscarUm(@PathVariable Long id) {
    return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
    service.excluir(id);
    }
}