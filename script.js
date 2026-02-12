
const CONFIG = {
    USE_API: true,
    API_URL: 'http://localhost:8080/tarefas'
};

let todos = [];
let currentFilter = 'all';
let todoToDelete = null;

const form = document.getElementById('todoForm');
const tasksContainer = document.getElementById('tasksContainer');
const totalTasksEl = document.getElementById('totalTasks');
const statusDot = document.getElementById('statusDot');
const modeText = document.getElementById('modeText');

document.addEventListener('DOMContentLoaded', () => {
    setupModeDisplay();
    fetchTodos();

    //setar data mínima como hoje
    document.getElementById('dataLimite').min = new Date().toISOString().split('T')[0];
});

function setupModeDisplay() {
    if (CONFIG.USE_API) {
        modeText.innerText = "Conectado ao Spring";
        statusDot.classList.replace('bg-green-500', 'bg-blue-500');
    } else {
        modeText.innerText = "Local Storage (Demo)";
        //dados iniciais fake se estiver vazio
        if(!localStorage.getItem('todos')) {
            const fakes = [
                { id: 1, nome: "Criar Controller Spring", descricao: "Implementar @RestController para Todo", prioridade: "ALTA", concluida: false, dataLimite: "2023-12-01" },
                { id: 2, nome: "Configurar Banco de Dados", descricao: "Configurar application.properties para H2 ou Postgres", prioridade: "MEDIA", concluida: true, dataLimite: "2023-11-20" },
            ];
            localStorage.setItem('todos', JSON.stringify(fakes));
        }
    }
}

async function fetchTodos() {
    if (CONFIG.USE_API) {
        try {
            const response = await fetch(CONFIG.API_URL);
            if (!response.ok) throw new Error('Erro na API');
            todos = await response.json();
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
            alert("Erro ao conectar com a API. Verifique se o backend está rodando.");
        }
    } else {
        const stored = localStorage.getItem('todos');
        todos = stored ? JSON.parse(stored) : [];
    }
    renderTodos();
}

async function createTodo(todo) {
    if (CONFIG.USE_API) {
        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo)
            });
            if (response.ok) fetchTodos();
        } catch (error) { console.error(error); }
    } else {
        todo.id = Date.now();
        todos.push(todo);
        saveLocal();
        renderTodos();
    }
}

async function toggleTodoStatus(id, currentStatus) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Inverte status
    const updatedTodo = { ...todo, concluida: !currentStatus };

    if (CONFIG.USE_API) {
        try {
            // Opção A: PUT (Atualiza tudo)
            const response = await fetch(`${CONFIG.API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTodo)
            });

            if (response.ok) fetchTodos();
        } catch (error) { console.error(error); }
    } else {
        todo.concluida = !currentStatus;
        saveLocal();
        renderTodos();
    }
}

async function deleteTodoApi(id) {
    if (CONFIG.USE_API) {
        try {
            const response = await fetch(`${CONFIG.API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) fetchTodos();
        } catch (error) { console.error(error); }
    } else {
        todos = todos.filter(t => t.id !== id);
        saveLocal();
        renderTodos();
    }
    closeModal();
}

function saveLocal() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTodo = {
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        prioridade: document.getElementById('prioridade').value, // ALTA, MEDIA, BAIXA
        dataLimite: document.getElementById('dataLimite').value, // YYYY-MM-DD
        concluida: false
    };

    createTodo(newTodo);
    form.reset();
});

function renderTodos() {
    tasksContainer.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'pending') return !todo.concluida;
        if (currentFilter === 'completed') return todo.concluida;
        return true;
    });

    totalTasksEl.innerText = filteredTodos.length;

    if (filteredTodos.length === 0) {
        tasksContainer.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center text-gray-400 mt-10">
                <i class="fa-regular fa-clipboard text-4xl mb-3"></i>
                <p>Nenhuma tarefa encontrada.</p>
            </div>
        `;
        return;
    }

    filteredTodos.forEach(todo => {
        const card = document.createElement('div');
        card.className = `task-card bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative overflow-hidden group ${todo.concluida ? 'opacity-75' : ''}`;

        let priorityClass = '';
        let priorityLabel = '';

        switch(todo.prioridade) {
            case 'ALTA':
                priorityClass = 'bg-red-100 text-red-700 border-red-200';
                priorityLabel = 'Alta';
                break;
            case 'MEDIA': // Caso backend envie sem acento
            case 'MÉDIA':
                priorityClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
                priorityLabel = 'Média';
                break;
            default:
                priorityClass = 'bg-green-100 text-green-700 border-green-200';
                priorityLabel = 'Baixa';
        }

        //formatar Data
        const dataParts = todo.dataLimite ? todo.dataLimite.split('-') : []; // YYYY-MM-DD
        const dataFormatada = dataParts.length === 3 ? `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}` : 'Sem data';

        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded border ${priorityClass}">
                    ${priorityLabel}
                </span>
                
                <div class="flex gap-2">
                    <button onclick="toggleTodoStatus(${todo.id}, ${todo.concluida})" class="text-gray-400 hover:text-indigo-600 transition-colors" title="${todo.concluida ? 'Marcar pendente' : 'Concluir'}">
                        <i class="fa-regular ${todo.concluida ? 'fa-square-check text-indigo-600' : 'fa-square'} text-xl"></i>
                    </button>
                    <button onclick="openDeleteModal(${todo.id})" class="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="Excluir">
                        <i class="fa-regular fa-trash-can text-lg"></i>
                    </button>
                </div>
            </div>
            
            <h3 class="text-lg font-bold text-gray-800 mb-1 ${todo.concluida ? 'line-through text-gray-500' : ''}">${todo.nome}</h3>
            <p class="text-sm text-gray-600 mb-4 line-clamp-3">${todo.descricao}</p>
            
            <div class="flex items-center text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
                <i class="fa-regular fa-calendar mr-1.5"></i>
                <span>${dataFormatada}</span>
                ${todo.concluida ? '<span class="ml-auto text-green-600 font-medium flex items-center"><i class="fa-solid fa-check mr-1"></i>Concluída</span>' : ''}
            </div>
            
            <!-- barra lateral colorida baseada na prioridade -->
            <div class="absolute left-0 top-0 bottom-0 w-1 ${todo.prioridade === 'ALTA' ? 'bg-red-500' : (todo.prioridade === 'MEDIA' || todo.prioridade === 'MÉDIA' ? 'bg-yellow-400' : 'bg-green-500')}"></div>
        `;
        tasksContainer.appendChild(card);
    });
}

function filterTasks(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if(btn.dataset.filter === filter) {
            btn.classList.add('bg-indigo-100', 'text-indigo-700');
            btn.classList.remove('text-gray-600', 'hover:bg-gray-100');
        } else {
            btn.classList.remove('bg-indigo-100', 'text-indigo-700');
            btn.classList.add('text-gray-600', 'hover:bg-gray-100');
        }
    });
    renderTodos();
}

function openDeleteModal(id) {
    todoToDelete = id;
    document.getElementById('deleteModal').classList.remove('hidden');
}

function closeModal() {
    todoToDelete = null;
    document.getElementById('deleteModal').classList.add('hidden');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if(todoToDelete) deleteTodoApi(todoToDelete);
});

document.getElementById('deleteModal').addEventListener('click', (e) => {
    if(e.target === document.getElementById('deleteModal')) closeModal();
});