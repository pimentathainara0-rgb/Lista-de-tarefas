'use strict'

const switcher = document.querySelector('.btn');
const tarefaInput = document.getElementById("tarefa");
const adicionarBotao = document.getElementById("adicionar");
const listaTarefas = document.getElementById("tarefas");
const dataInput = document.getElementById("data");
const prevDayBtn = document.getElementById("prevDay");
const nextDayBtn = document.getElementById("nextDay");
const dataTitulo = document.getElementById("dataTitulo");

let selectedDate = new Date().toISOString().slice(0, 10);
const tarefasPorData = JSON.parse(localStorage.getItem("tarefasPorData") || "{}");

function salvarTarefas() {
    localStorage.setItem("tarefasPorData", JSON.stringify(tarefasPorData));
}

function formatDateTitle(isoDate) {
    const data = new Date(isoDate);
    return data.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function getTarefasDoDia(date) {
    if (!tarefasPorData[date]) tarefasPorData[date] = [];
    return tarefasPorData[date];
}

function renderTarefas() {
    listaTarefas.innerHTML = "";
    const tarefas = getTarefasDoDia(selectedDate);

    tarefas.forEach((tarefa, index) => {
        const novaTarefa = document.createElement("li");
        if (tarefa.concluida) novaTarefa.classList.add("completed");

        novaTarefa.innerHTML = `
            <label>
                <input type="checkbox" class="concluir" data-index="${index}" ${tarefa.concluida ? "checked" : ""}>
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
    const tarefaTexto = tarefaInput.value.trim();
    if (tarefaTexto === "") return;

    getTarefasDoDia(selectedDate).push({
        texto: tarefaTexto,
        concluida: false
    });

    tarefaInput.value = "";
    salvarTarefas();
    renderTarefas();
}

function alterarData(days) {
    const data = new Date(selectedDate);
    data.setDate(data.getDate() + days);
    selectedDate = data.toISOString().slice(0, 10);
    renderTarefas();
}

switcher.addEventListener('click', function() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');

    if (document.body.classList.contains('dark-theme')) {
        this.textContent = 'Light';
    } else {
        this.textContent = 'Dark';
    }
});

adicionarBotao.addEventListener("click", adicionarTarefa);
tarefaInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") adicionarTarefa();
});

listaTarefas.addEventListener("click", function (e) {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("excluir")) {
        getTarefasDoDia(selectedDate).splice(index, 1);
        salvarTarefas();
        renderTarefas();
        return;
    }

    if (e.target.classList.contains("concluir")) {
        const tarefa = getTarefasDoDia(selectedDate)[index];
        tarefa.concluida = e.target.checked;
        salvarTarefas();
        renderTarefas();
        return;
    }
});

dataInput.addEventListener("change", function () {
    selectedDate = this.value;
    renderTarefas();
});

prevDayBtn.addEventListener("click", function () {
    alterarData(-1);
});

nextDayBtn.addEventListener("click", function () {
    alterarData(1);
});

renderTarefas();