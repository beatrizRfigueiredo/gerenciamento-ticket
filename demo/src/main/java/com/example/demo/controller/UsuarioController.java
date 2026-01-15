package com.example.demo.controller;

import com.example.demo.model.Usuario;
import com.example.demo.repository.RepositorioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private RepositorioUsuario repository;

    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        Usuario existe = repository.findByCpf(usuario.getCpf());
        if (existe != null) {
        throw new RuntimeException("Erro: Já existe um usuário com este CPF");
        }
        return repository.save(usuario);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario loginData) {
        Usuario usuarioBanco = repository.findByCpf(loginData.getCpf());
        if (usuarioBanco != null && usuarioBanco.getSenha().equals(loginData.getSenha())) {
        return usuarioBanco;
        }
        throw new RuntimeException("CPF ou senha incorretos");
    }

    @GetMapping
    public List<Usuario> listar() {
    return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deletarPorId(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @PutMapping("/recuperar-senha")
    public void recuperarSenha(@RequestBody Usuario dados) {
        Usuario usuario = repository.findByCpf(dados.getCpf());

        if (usuario != null) {
            usuario.setSenha(dados.getSenha());
            repository.save(usuario);
        } else {
            throw new RuntimeException("CPF não encontrado!");
        }
    }
}