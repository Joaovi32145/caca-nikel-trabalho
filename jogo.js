// Elementos
const menu = document.getElementById('menu');
const jogoDiv = document.getElementById('jogo');
const rankingDiv = document.getElementById('ranking');

const essenciasSpan = document.getElementById('essencias');
let essencias = 10;

const rolos = [
    document.getElementById('rolo1'),
    document.getElementById('rolo2'),
    document.getElementById('rolo3')
];

// Botões
document.getElementById('btn-jogar').onclick = () => mostrarTela(jogoDiv);
document.getElementById('btn-ranking').onclick = () => { atualizarRanking(); mostrarTela(rankingDiv); };
document.getElementById('btn-voltar').onclick = () => mostrarTela(menu);
document.getElementById('btn-voltar-ranking').onclick = () => mostrarTela(menu);
document.getElementById('btn-girar').onclick = girar;

// Reset do ranking com senha
document.getElementById('btn-resetar-ranking').addEventListener('click', () => {
    const senha = prompt("Digite a senha para apagar o histórico:");
    if (senha === "123") {
        localStorage.removeItem('ganhadores');
        atualizarRanking();
        alert("✅ Histórico de ganhadores apagado!");
    } else if (senha !== null) {
        alert("❌ Senha incorreta!");
    }
});

// Símbolos do caça-níquel (emojis Arcane)
const simbolos = ['🧨','💣','⚡','🔫','💥','🔧','🩸'];

// Funções principais
function mostrarTela(tela) {
    menu.classList.add('escondido');
    jogoDiv.classList.add('escondido');
    rankingDiv.classList.add('escondido');
    tela.classList.remove('escondido');
}

function resetJogo() {
    essencias = 10;
    essenciasSpan.textContent = essencias;
    rolos.forEach(r => r.textContent = '?');
}

// Salva ganhador com contagem de vitórias
function salvarGanhador(nome) {
    let ganhadores = JSON.parse(localStorage.getItem('ganhadores')) || [];
    const existente = ganhadores.find(g => g.nome === nome);
    if (existente) {
        existente.vitorias++;
    } else {
        ganhadores.push({nome, vitorias: 1});
    }
    localStorage.setItem('ganhadores', JSON.stringify(ganhadores));
}

// Atualiza ranking no HTML
function atualizarRanking() {
    let ganhadores = JSON.parse(localStorage.getItem('ganhadores')) || [];
    const lista = document.getElementById('lista-ranking');
    lista.innerHTML = '';
    ganhadores.forEach(g => {
        const li = document.createElement('li');
        li.textContent = g.vitorias > 1 ? `${g.nome} (${g.vitorias})` : g.nome;
        lista.appendChild(li);
    });
}

// Giro do caça-níquel com animação
function girar() {
    if (essencias <= 1) {
        alert("💥 Suas Essências Hextech acabaram!");
        if (confirm("Deseja tentar novamente?")) resetJogo();
        else mostrarTela(menu);
        return;
    }

    essencias--;
    essenciasSpan.textContent = essencias;

    // Animação: gira por 1 segundo
    let passos = 10;
    let intervalo = 100;
    let cont = 0;

    let anim = setInterval(() => {
        rolos.forEach(r => {
            const idx = Math.floor(Math.random() * simbolos.length);
            r.textContent = simbolos[idx];
            r.style.transform = `translateY(${Math.random()*20-10}px)`; // leve movimento vertical
        });
        cont++;
        if (cont >= passos) {
            clearInterval(anim);
            pararRolos(simbolos);
        }
    }, intervalo);
}

// Função para parar os rolos e verificar vitória
function pararRolos(simbolos) {
    let resultado = [];
    for (let i = 0; i < 2; i++) {
        const idx = Math.floor(Math.random() * simbolos.length);
        rolos[i].textContent = simbolos[idx];
        rolos[i].style.transform = `translateY(0px)`;
        resultado.push(simbolos[idx]);
    }

    // Terceiro rolo com 35% chance de repetir o primeiro (mais fácil ganhar)
    if (Math.random() < 0.35) {
        rolos[2].textContent = resultado[0];
        resultado.push(resultado[0]);
    } else {
        const idx = Math.floor(Math.random() * simbolos.length);
        rolos[2].textContent = simbolos[idx];
        resultado.push(simbolos[idx]);
    }
    rolos[2].style.transform = `translateY(0px)`;

    const counts = {};
    resultado.forEach(s => counts[s] = (counts[s] || 0) + 1);

    // Delay de 1 segundo antes de mostrar vitória ou derrota
    setTimeout(() => {
        if (Object.values(counts).includes(3)) {
            alert("🏆 Você dominou a Zaun! Vitória!");
            let nome = prompt("Digite seu nome de Inventor:") || "Anônimo";
            salvarGanhador(nome);
            resetJogo();
            if (!confirm("Deseja tentar novamente?")) mostrarTela(menu);
        } else if (essencias <= 1) {
            alert("💥 Você perdeu todas as Essências Hextech!");
            resetJogo();
            if (!confirm("Deseja tentar novamente?")) mostrarTela(menu);
        }
    }, 1000);
}

// Inicializa
essenciasSpan.textContent = essencias;
