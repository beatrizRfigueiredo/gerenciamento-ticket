# Sistema de Gerenciamento de Tickets de suporte

Sistema web para gerenciamento de tickets, desenvolvido com Spring Boot no backend e HTML, CSS e JavaScript no frontend.
O sistema permite autenticação de usuários, abertura e acompanhamento de chamados, com separação de perfis (cliente e técnico).

## Funcionalidades

- Login de usuários
- Cadastro de usuários
- Recuperação de senha
- Abertura de novos chamados
- Visualização de chamados por perfil
- Área do cliente
- Área do técnico

## Tecnologias Utilizadas
 
### Backend

- Java
- Spring Boot
- JPA / Hibernate
- Gradle
- PostgreSQL

### Frontend

- HTML5
- CSS3
- JavaScript

### Outros

- Git
- GitHub
- IntelliJ IDEA

## Estrutura do Projeto 
```bash
src/
 └── main/
     ├── java/
     │   └── com.example.demo/
     │       ├── controller/
     │       │   ├── TicketController.java
     │       │   └── UsuarioController.java
     │       ├── model/
     │       │   ├── Ticket.java
     │       │   └── Usuario.java
     │       ├── repository/
     │       │   ├── Repositorio.java
     │       │   └── RepositorioUsuario.java
     │       ├── service/
     │       └── DemoApplication.java
     │
     └── resources/
         ├── static/
         │   ├── index.html
         │   ├── login.html
         │   ├── cadastro.html
         │   ├── cliente.html
         │   ├── tecnico.html
         │   ├── tecnico-chamados.html
         │   ├── novo-chamado.html
         │   ├── recuperar-senha.html
         │   └── script.js
         │
         └── application.properties
```

## Arquitetura
O projeto segue uma arquitetura em camadas:

- Controller: responsável por receber as requisições HTTP e direcionar o fluxo da aplicação
- Model: representa as entidades do sistema
- Repository: responsável pela comunicação com o banco de dados
- Service: camada destinada às regras de negócio

## Como executar o projeto

- Pré-requisitos
Java 17 (ou compatível)
Gradle
IDE (IntelliJ IDEA, Eclipse ou VS Code)

- Configuração do Banco de Dados

1.  Acesse o PostgreSQL e crie o banco de dados:
    ```sql
    CREATE DATABASE tickets_db;
    ```
2.  Certifique-se de que a tabela `tickets` possua a coluna `nomecliente` e a relação `usuario_id`:
    ```sql
    ALTER TABLE tickets ADD COLUMN nomecliente VARCHAR(255);
    ALTER TABLE tickets ADD COLUMN usuario_id INTEGER;
    ```

- Clone o repositório
  
```bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
```

- Acesse a pasta do projeto
```bash
cd demo
```

- Configure as credenciais
No arquivo src/main/resources/application.properties, ajuste o usuário e senha do seu PostgreSQL:

Properties
```bash
spring.datasource.username=seu_usuario_aqui
spring.datasource.password=sua_senha_aqui
```

- Execute a aplicação
Você pode rodar via terminal:
```bash
./gradlew bootRun
```

Ou execute a classe DemoApplication.java diretamente pela sua IDE.

## Acesse no navegador
Abra o navegador e acesse a página de login: http://localhost:8080/
