'use strict'

const switcher = document.querySelector('.btn');
const tarefaInput = document.getElementById('tarefa');
const adicionarBotao = document.getElementById('adicionar');
const listaTarefas = document.getElementById('tarefas');
const dataInput = document.getElementById('data');
const prevDayBtn = document.getElementById('prevDay');
const nextDayBtn = document.getElementById('nextDay');
const dataTitulo = document.getElementById('dataTitulo');

const loginArea = document.getElementById('loginArea');
const appContent = document.getElementById('appContent');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const loginMsg = document.getElementById('loginMsg');

let selectedDate = new Date().toISOString().slice(0, 10);
let tarefasPorData = {};
let currentUser = localStorage.getItem('currentUser') || null;

function userKey(user) {
    return `tarefas_${user}`;
}

function loadUserData(user) {
    tarefasPorData = JSON.parse(localStorage.getItem(userKey(user)) || '{}');
    if (!tarefasPorData) tarefasPorData = {};
}

function saveUserData() {
    if (!currentUser) return;
    localStorage.setItem(userKey(currentUser), JSON.stringify(tarefasPorData));
}

function formatDateTitle(isoDate) {
    const data = new Date(isoDate);
    return data.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function getTarefasDoDia(date) {
    if (!tarefasPorData[date]) tarefasPorData[date] = [];
    return tarefasPorData[date];
}

function renderTarefas() {
    if (!currentUser) return;
    listaTarefas.innerHTML = '';
    const tarefas = getTarefasDoDia(selectedDate);

    tarefas.forEach((tarefa, index) => {
        const novaTarefa = document.createElement('li');
        if (tarefa.concluida) novaTarefa.classList.add('completed');

        novaTarefa.innerHTML = `
            <label>
                <input type="checkbox" class="concluir" data-index="${index}" ${tarefa.concluida ? 'checked' : ''}>
                <span>${tarefa.texto}</span>
            </label>
            <button class="excluir" data-index="${index}">Excluir</button>
        `;
        listaTarefas.appendChild(novaTarefa);
    });

    dataInput.value = selectedDate;
    dataTitulo.textContent = formatDateTitle(selectedDate);
}

function adicionarTarefa() {
    if (!currentUser) return;
    const tarefaTexto = tarefaInput.value.trim();
    if (tarefaTexto === '') return;

    getTarefasDoDia(selectedDate).push({
        texto: tarefaTexto,
        concluida: false
    });

    tarefaInput.value = '';
    saveUserData();
    renderTarefas();
}

function alterarData(days) {
    const data = new Date(selectedDate);
    data.setDate(data.getDate() + days);
    selectedDate = data.toISOString().slice(0, 10);
    renderTarefas();
}

function showApp() {
    loginArea.style.display = 'none';
    appContent.style.display = '';
    renderTarefas();
}

function showLogin() {
    loginArea.style.display = '';
    appContent.style.display = 'none';
}

btnRegister.addEventListener('click', function() {
    const user = loginUser.value.trim();
    const pass = loginPass.value;

    if (!user || !pass) {
        loginMsg.textContent = 'Preencha usuário e senha';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user]) {
        loginMsg.textContent = 'Usuário já existe';
        return;
    }

    users[user] = pass;
    localStorage.setItem('users', JSON.stringify(users));
    loginMsg.textContent = 'Registrado com sucesso. Faça login.';
});

btnLogin.addEventListener('click', function() {
    const user = loginUser.value.trim();
    const pass = loginPass.value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (!users[user] || users[user] !== pass) {
        loginMsg.textContent = 'Usuário ou senha inválidos';
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', currentUser);
    loadUserData(currentUser);
    loginMsg.textContent = '';
    showApp();
});

switcher.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    this.textContent = document.body.classList.contains('dark-theme') ? 'Light' : 'Dark';
});

adicionarBotao.addEventListener('click', adicionarTarefa);
tarefaInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') adicionarTarefa();
});

listaTarefas.addEventListener('click', function(e) {
    const index = e.target.dataset.index;
    if (e.target.classList.contains('excluir')) {
        getTarefasDoDia(selectedDate).splice(index, 1);
        saveUserData();
        renderTarefas();
        return;
    }

    if (e.target.classList.contains('concluir')) {
        const tarefa = getTarefasDoDia(selectedDate)[index];
        tarefa.concluida = e.target.checked;
        saveUserData();
        renderTarefas();
    }
});

dataInput.addEventListener('change', function() {
    selectedDate = this.value;
    renderTarefas();
});

prevDayBtn.addEventListener('click', function() {
    alterarData(-1);
});

nextDayBtn.addEventListener('click', function() {
    alterarData(1);
});

if (currentUser) {
    loadUserData(currentUser);
    showApp();
} else {
    showLogin();
}

const btnLogout = document.getElementById('btnLogout');

btnLogout.addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    location.reload();
});