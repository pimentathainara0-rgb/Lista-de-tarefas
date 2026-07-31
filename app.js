'use strict'

const switcher = document.querySelector('.btn');

switcher.addEventListener('click', function() {
    toggleTheme();

    var className = document.body.className;
    if (className === 'light-theme') {
        this.textContent = 'Dark';
    } else {
        this.textContent = 'Light';
    }

    console.log('current class name: ' + className);
});

function toggleTheme() {
    document.body.classList.toggle('dark-theme');

    var className = document.body.className;
    if (className === 'light-theme') {
        this.textContent = 'Dark';
    } else {
        this.textContent = 'Light';
    }

    console.log('current class name: ' + className);
}

//Variáveis
const tarefaInput = document.getElementById("tarefa");
const adicionarBotao = 
document.getElementById("adicionar");
const listaTarefas = document.getElementById("tarefas");

//Event Listeners
adicionarBotao.addEventListener("click", adicionarTarefa);
tarefaInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        adicionarTarefa();
    }
});
//Funções
function adicionarTarefa() {
    const tarefaTexto = tarefaInput.value;
    if (tarefaTexto.trim() !== "") {
        const novaTarefa = document.createElement("li");
        novaTarefa.innerHTML = `
        ${tarefaTexto}<button class="excluir">Excluir</button>
        `;
        listaTarefas.appendChild(novaTarefa);
        tarefaInput.value = "";
    }
}

listaTarefas.addEventListener("click", function (e) {
    if (e.target.classList.contains("excluir")) {
        e.target.parentElement.remove();
    }
});