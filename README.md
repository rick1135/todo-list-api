# 📝 Todo List API

Uma API REST para gerenciamento de tarefas (To-Do List) desenvolvida utilizando Java Spring Boot, juntamente com PostgreSQL como banco de dados e Docker para containerização.

## Tecnologias Utilizadas

- **Java 21**
- **Spring Boot 4.0.2**
  - Spring Data JPA
  - Spring Web MVC
- **PostgreSQL 15**
- **Lombok**
- **Docker & Docker Compose**
- **Maven**

## 📋 Funcionalidades

-  Criar novas tarefas
-  Listar todas as tarefas
-  Atualizar tarefas existentes
-  Deletar tarefas
-  Definir prioridade (ALTA, MEDIA, BAIXA)
-  Marcar tarefas como concluídas
-  Definir data limite para tarefas
-  Interface web para interação com a API

## 🗄️ Modelo de Dados

### Tarefa (Task)

| Campo       | Tipo              | Descrição                           |
|-------------|-------------------|-------------------------------------|
| id          | Long              | Identificador único (auto-gerado)  |
| nome        | String            | Nome da tarefa                      |
| descricao   | String            | Descrição detalhada                 |
| concluida   | boolean           | Status de conclusão                 |
| prioridade  | Prioridade (enum) | ALTA, MEDIA ou BAIXA                |
| dataLimite  | LocalDate         | Data limite para conclusão          |

## 🔌 Endpoints da API

Base URL: `http://localhost:8080/tarefas`

### Criar Tarefa
```http
POST /tarefas
Content-Type: application/json

{
  "nome": "Minha Tarefa",
  "descricao": "Descrição da tarefa",
  "concluida": false,
  "prioridade": "ALTA",
  "dataLimite": "2026-12-31"
}
```

### Listar Todas as Tarefas
```http
GET /tarefas
```

### Atualizar Tarefa
```http
PUT /tarefas/{id}
Content-Type: application/json

{
  "nome": "Tarefa Atualizada",
  "descricao": "Nova descrição",
  "concluida": true,
  "prioridade": "MEDIA",
  "dataLimite": "2026-12-31"
}
```

### Deletar Tarefa
```http
DELETE /tarefas/{id}
```

## 🐳 Executando com Docker

### Pré-requisitos
- Docker
- Docker Compose

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=todolist
DB_PORT=5432
```

### 2. Iniciar os Containers

```bash
docker compose up --build
```

### 3. Acessar a Aplicação

- **API:** http://localhost:8080/tarefas
- **Frontend:** abra o arquivo `index.html`

### 4. Parar os Containers

```bash
docker-compose down
```

### 5. Parar e Remover Volumes

```bash
docker-compose down -v
```

## 💻 Executando Localmente (Sem Docker)

### Pré-requisitos
- Java 21
- Maven 3.9+
- PostgreSQL 15

### 1. Configurar PostgreSQL

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE todolist;
```

### 2. Configurar Variáveis de Ambiente

Configure as seguintes variáveis de ambiente:

```bash
# Windows PowerShell
$env:DB_URL="jdbc:postgresql://localhost:5432/todolist"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="sua_senha"

# Linux/Mac
export DB_URL="jdbc:postgresql://localhost:5432/todolist"
export DB_USERNAME="postgres"
export DB_PASSWORD="sua_senha"
```

### 3. Compilar e Executar

```bash
# Compilar o projeto
./mvnw clean package

# Executar a aplicação
./mvnw spring-boot:run
```

A aplicação estará disponível em: http://localhost:8080

## 📁 Estrutura do Projeto

```
todo-list-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/rick1135/todo_list_api/
│   │   │       ├── TodoListApiApplication.java
│   │   │       ├── config/
│   │   │       │   └── WebConfig.java
│   │   │       ├── controller/
│   │   │       │   └── TarefaController.java
│   │   │       ├── model/
│   │   │       │   ├── Tarefa.java
│   │   │       │   └── Prioridade.java
│   │   │       ├── repository/
│   │   │       │   └── TarefaRepository.java
│   │   │       └── service/
│   │   │           └── TarefaService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── com/rick1135/todo_list_api/
│               └── TodoListApiApplicationTests.java
├── docker-compose.yml
├── Dockerfile
├── index.html
├── script.js
├── styles.css
├── pom.xml
└── README.md
```

## 🔧 Configuração

### application.properties

```properties
spring.application.name=todo-list-api

# Database Configuration
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```
