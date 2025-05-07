const container = document.getElementById('container-pergunta');
const btNext = document.getElementById('bt');
const resultadoFinal = document.getElementById('resultado');
const reiniciarQuiz = document.getElementById('reiniciar');
const callAction = document.getElementById('cta-container');

let perguntas = [];
let perguntaAtual = 0;
let respostas = [];

async function carregarPerguntas() {
    try {
        const response = await fetch('https://sheetdb.io/api/v1/a9hfqz5w1sggh');
        const data = await response.json();
        perguntas = data.map((post, index) => ({
            id: index + 1,
            texto: post.texto,
            opcoes: ['Sim', 'Não']
        }));
        mostrarPergunta();
    } catch (error) {
        container.innerHTML = 'Erro ao carregar as perguntas. Por favor, atualize a página e tente novamente.';
        console.error(error);
    }
}

function mostrarPergunta() {
    if (perguntaAtual < perguntas.length) {
        const pergunta = perguntas[perguntaAtual];
        container.innerHTML = `
            <div class="pergunta">
                <p>Pergunta ${perguntaAtual + 1} de ${perguntas.length}</p>
                <p>${pergunta.texto}</p>
                ${pergunta.opcoes.map(opcao => `
                    <button class="bt-pergunta" role="button" aria-label="Selecionar opção ${opcao}" onclick="selecionarOpcao('${opcao}')">${opcao}</button>
                `).join('')}
            </div>
        `;
        const botoes = document.querySelectorAll('.bt-pergunta');

        botoes.forEach(botao => {
            botao.addEventListener('click', () => {
                botoes.forEach(b => b.classList.remove('selection'));
                botao.classList.add('selection');
            });
        });

        setTimeout(() => {
            document.querySelector('.pergunta').classList.add('mostrar');
        }, 10);
        btNext.style.display = "none";
        btNext.className = "bt-proxima"; // Reseta a classe
        btNext.innerText = perguntaAtual === perguntas.length - 1 ? "Resultado" : "Próxima pergunta";
    } else {
        mostrarResultado();
    }
}

function selecionarOpcao(opcao) {
    respostas.push(opcao);
    btNext.style.display = 'inline-block';
    btNext.focus(); // Adiciona foco ao botão "Próxima"
}

function mostrarResultado() {
    container.innerHTML = '';
    btNext.style.display = 'none';
    const simResp = respostas.filter(resposta => resposta === "Sim");
    const resposta = simResp.length > 0 ? 'Ótimo! Você já está por dentro!' : 'Agora você sabe — e pode contar com um front-end de confiança.';
    resultadoFinal.textContent = resposta;
    setTimeout(() => {
        resultadoFinal.classList.add('post');
    }, 10);
    callAction.style.display = 'inline-block';
    reiniciarQuiz.style.display = 'inline-block';
}

btNext.addEventListener("click", () => {
    if (!respostas[perguntaAtual]) {
        alert('Por favor, selecione uma opção antes de prosseguir.');
        return;
    }
    perguntaAtual++;
    mostrarPergunta();
});

reiniciarQuiz.addEventListener("click", () => {
    perguntaAtual = 0;
    respostas = [];
    reiniciarQuiz.style.display = 'none';
    resultadoFinal.textContent = '';
    resultadoFinal.classList.remove('post');
    callAction.style.display = 'none';
    mostrarPergunta();
});

carregarPerguntas();