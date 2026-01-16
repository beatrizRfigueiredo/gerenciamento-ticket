const API_URL = "http://localhost:8080";

async function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const tipoEl = document.querySelector('input[name="tipo_usuario"]:checked');

    if (!tipoEl) {
        alert("Por favor, selecione o tipo de usuário.");
        return;
    }

    const tipo = tipoEl.value;

    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                cpf: cpf,
                senha: senha,
                tipo: tipo
            })
        });

        if (response.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "login.html";
        } else {
            const erro = await response.text();
            alert("Erro ao cadastrar: " + erro);
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
    }
}

async function fazerLogin(event) {
    event.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const tipoEl = document.querySelector('input[name="tipo_usuario_login"]:checked');

    if (!tipoEl) {
        alert("Selecione se você é Técnico ou Cliente para prosseguir.");
        return;
    }

    const tipoSelecionado = tipoEl.value;

    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpf: cpf,
                senha: senha
            })
        });

        if (response.ok) {
            const usuario = await response.json();
            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

            if (tipoSelecionado === 'tecnico') {
                window.location.href = "tecnico-chamados.html";
            } else {
                window.location.href = "cliente.html";
            }
        } else {
            alert("CPF ou Senha incorretos. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao tentar conectar com o servidor.");
    }
}

function sair() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = "login.html";
}

async function carregarChamados() {
    const container = document.querySelector('.lista-chamados');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/tickets`);
        if (!response.ok) throw new Error("Erro ao buscar tickets");

        const chamados = await response.json();
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const isTecnico = window.location.href.includes("tecnico");

        container.innerHTML = "";

        chamados.forEach(ticket => {
            let deveExibir = false;

            if (isTecnico) {
                deveExibir = true;
            } else if (usuarioLogado && ticket.usuario && ticket.usuario.id == usuarioLogado.id) {
                deveExibir = true;
            }

            if (!deveExibir) return;

            const div = document.createElement('div');
            div.className = 'item-chamado';

            if (isTecnico) {
                const nomeExibicao = ticket.nomecliente || (ticket.usuario ? ticket.usuario.nome : "Não informado");

                div.innerHTML = `
                    <div class="conteudo-texto">
                        <h3>#${ticket.id} - ${ticket.titulo}</h3>
                        <p>${ticket.descricao}</p>
                        <div class="detalhes">
                            <strong>Solicitante:</strong> ${nomeExibicao}
                        </div>
                        <div class="detalhes">
                            <strong>Prioridade:</strong> ${ticket.prioridade || 'Normal'} | <strong>Status:</strong> ${ticket.status}
                        </div>
                        <br>
                        <span>Alterar Status:</span>
                        <select class="select-status" onchange="atualizarStatus(${ticket.id}, this.value)">
                            <option value="ABERTO" ${ticket.status === 'ABERTO' ? 'selected' : ''}>Aberto</option>
                            <option value="EM ANDAMENTO" ${ticket.status === 'EM ANDAMENTO' ? 'selected' : ''}>Em Andamento</option>
                            <option value="FECHADO" ${ticket.status === 'FECHADO' ? 'selected' : ''}>Fechado</option>
                        </select>
                    </div>
                    <button class="botao-excluir" onclick="deletarChamado(${ticket.id})" title="Excluir Chamado">
                        <svg class="icone-lixeira" viewBox="0 0 24 24" width="24" height="24" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                `;
            } else {
                div.innerHTML = `
                    <div class="info-principal">
                        <h3>${ticket.titulo}</h3>
                        <p>${ticket.descricao}</p>
                        <div class="info-meta">Prioridade: ${ticket.prioridade || 'Normal'}</div>
                    </div>
                    <span class="status-texto">${ticket.status}</span>
                `;
            }

            container.appendChild(div);
        });

        if (container.innerHTML === "") {
            container.innerHTML = "<p style='text-align:center; padding:20px;'>Nenhum chamado encontrado.</p>";
        }

    } catch (error) {
        console.error("Erro ao carregar lista:", error);
        container.innerHTML = "<p>Erro técnico ao carregar chamados.</p>";
    }
}

async function deletarChamado(id) {
    if (confirm("Tem certeza que deseja excluir permanentemente este chamado?")) {
        try {
            const response = await fetch(`${API_URL}/tickets/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                carregarChamados();
            } else {
                alert("Não foi possível excluir o chamado.");
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    }
}

async function atualizarStatus(id, novoStatus) {
    try {
        const responseBusca = await fetch(`${API_URL}/tickets/${id}`);
        const ticket = await responseBusca.json();

        ticket.status = novoStatus;

        const responseUpdate = await fetch(`${API_URL}/tickets/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket)
        });

        if (responseUpdate.ok) {
            alert("Status atualizado com sucesso!");
            carregarChamados();
        }
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        alert("Falha ao atualizar status.");
    }
}

async function carregarUsuarios() {
    const container = document.querySelector('.lista-usuarios');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/usuarios`);
        const usuarios = await response.json();

        container.innerHTML = "";

        usuarios.forEach(user => {
            const div = document.createElement('div');
            div.className = 'item-usuario';
            div.innerHTML = `
                <div style="border-bottom: 1px solid #ddd; padding: 10px; margin-bottom: 10px;">
                    <h3>${user.nome} (${user.tipo})</h3>
                    <p>CPF: ${user.cpf} | ID: ${user.id}</p>
                    <button onclick="deletarUsuario(${user.id})" style="color: red; cursor: pointer;">Excluir Usuário</button>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}

async function deletarUsuario(id) {
    if (confirm("Deseja realmente remover este usuário do sistema?")) {
        try {
            const response = await fetch(`${API_URL}/usuarios/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                carregarUsuarios();
            }
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
        }
    }
}

async function fazerRecuperacao(event) {
    event.preventDefault();

    const cpf = document.getElementById('cpfRecuperar').value;
    const senha = document.getElementById('novaSenha').value;

    try {
        const response = await fetch(`${API_URL}/usuarios/recuperar-senha`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cpf: cpf,
                senha: senha
            })
        });

        if (response.ok) {
            alert("Senha redefinida com sucesso!");
            window.location.href = "login.html";
        } else {
            alert("CPF não localizado no banco de dados.");
        }
    } catch (error) {
        console.error("Erro na recuperação:", error);
        alert("Erro ao processar solicitação.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarChamados();
    carregarUsuarios();

    const formChamado = document.getElementById('form-novo-chamado');
    if (formChamado) {
        formChamado.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

            if (!usuarioLogado) {
                alert("Sessão expirada. Faça login novamente.");
                window.location.href = "login.html";
                return;
            }

            const payload = {
                nomecliente: document.getElementById('nomecliente').value,
                titulo: document.getElementById('titulo').value,
                descricao: document.getElementById('descricao').value,
                prioridade: document.getElementById('prioridade').value,
                status: 'ABERTO',
                usuario: {
                    id: usuarioLogado.id
                }
            };

            try {
                const response = await fetch(`${API_URL}/tickets`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert("Seu chamado foi enviado com sucesso!");
                    window.location.href = "cliente.html";
                } else {
                    alert("Erro ao enviar chamado.");
                }
            } catch (error) {
                console.error("Erro ao criar ticket:", error);
                alert("Erro de conexão ao criar chamado.");
            }
        });
    }
});