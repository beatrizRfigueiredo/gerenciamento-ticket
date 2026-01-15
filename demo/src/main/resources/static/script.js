const API_URL = "http://localhost:8080";

async function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const tipo = document.querySelector('input[name="tipo_usuario"]:checked').value;

    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cpf, senha, tipo })
        });

        if (response.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "login.html";
        } else {
            alert("Erro ao cadastrar. Verifique se o CPF já existe.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}

async function fazerLogin(event) {
    event.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const tipoSelecionado = document.querySelector(
        'input[name="tipo_usuario_login"]:checked'
    ).value;

    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha })
        });

        if (response.ok) {
            const usuario = await response.json();

            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

            if (tipoSelecionado === 'tecnico') {
                window.location.href = "tecnico.html";
            } else {
                window.location.href = "cliente.html";
            }

        } else {
            alert("CPF ou Senha incorretos!");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao tentar fazer login.");
    }
}

function sair() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "login.html";
}

async function carregarChamados() {
    try {
        const response = await fetch(`${API_URL}/tickets`);
        const chamados = await response.json();

        const container = document.querySelector('.lista-chamados');
        container.innerHTML = "";

        const isTecnico = window.location.href.includes("tecnico");

        chamados.forEach(ticket => {
            const div = document.createElement('div');
            div.className = 'item-chamado';

            if (isTecnico) {
                div.innerHTML = `
                    <div class="conteudo-texto">
                        <h3>${ticket.titulo}</h3>
                        <p>${ticket.descricao}</p>
                        <div class="detalhes">
                            Prioridade: <strong>${ticket.prioridade || 'Normal'}</strong> |
                            Status Atual: <strong>${ticket.status}</strong>
                        </div>
                        <br>
                        Mudar Status:
                        <select class="select-status" onchange="atualizarStatus(${ticket.id}, this.value)">
                            <option value="ABERTO" ${ticket.status === 'ABERTO' ? 'selected' : ''}>Aberto</option>
                            <option value="EM ANDAMENTO" ${ticket.status === 'EM ANDAMENTO' ? 'selected' : ''}>Andamento</option>
                            <option value="FECHADO" ${ticket.status === 'FECHADO' ? 'selected' : ''}>Fechado</option>
                        </select>
                    </div>
                    <button class="botao-excluir" onclick="deletarChamado(${ticket.id})">
                        <svg class="icone-lixeira" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6
                                     m3 0V4a2 2 0 0 1 2-2h4
                                     a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                `;
            } else {
                div.innerHTML = `
                    <div class="info-principal">
                        <h3>${ticket.titulo}</h3>
                        <p>${ticket.descricao}</p>
                        <div class="info-meta">
                            Prioridade: ${ticket.prioridade || 'Normal'}
                        </div>
                    </div>
                    <span class="status-texto">${ticket.status}</span>
                `;
            }

            container.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar chamados", error);
    }
}

async function deletarChamado(id) {
    if (confirm("Excluir este chamado?")) {
        await fetch(`${API_URL}/tickets/${id}`, { method: 'DELETE' });
        carregarChamados();
    }
}

async function atualizarStatus(id, novoStatus) {
    const res = await fetch(`${API_URL}/tickets/${id}`);
    const ticket = await res.json();

    ticket.status = novoStatus;

    await fetch(`${API_URL}/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
    });

    alert("Status alterado!");
    carregarChamados();

async function fazerRecuperacao(event) {
     event.preventDefault(); // Não deixa a página recarregar à toa

     const cpf = document.getElementById('cpfRecuperar').value;
     const senha = document.getElementById('novaSenha').value;

        try {
            const response = await fetch(`${API_URL}/usuarios/recuperar-senha`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, senha })
            });

            if (response.ok) {
                alert("Sucesso! Sua senha foi alterada.");
                window.location.href = "login.html";
            } else {
                alert("Erro: CPF não encontrado no sistema.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao conectar com o servidor. O Java está rodando?");
        }
    }
}