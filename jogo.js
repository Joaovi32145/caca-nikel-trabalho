const btnGirar = document.getElementById('btn-girar');
const essenciasSpan = document.getElementById('essencias');
const rolos = [
    document.getElementById('rolo1'),
    document.getElementById('rolo2'),
    document.getElementById('rolo3')
];
const mensagem = document.getElementById('mensagem');

const simbolos = ['🧨','💣','⚡','🔫','💥','🔧','🩸'];
let essencias = 5;
let girando = false;

const somFim = new Audio('https://www.myinstants.com/media/sounds/bo-womp.mp3'); // derrota
const somVitoria = new Audio('https://www.myinstants.com/media/sounds/139-item-catch.mp3'); // vitória
const somGiro = new Audio('https://www.myinstants.com/media/sounds/low-hp-pokemon.mp3'); // girando
somFim.preload = 'auto';
somVitoria.preload = 'auto';
somGiro.preload = 'auto';
somGiro.loop = true;

essenciasSpan.textContent = essencias;
mensagem.textContent = "Puxe a alavanca e boa sorte!";

function bloquearBotao() {
    girando = true;
    btnGirar.setAttribute('disabled','');
}

function desbloquearBotao() {
    girando = false;
    btnGirar.removeAttribute('disabled');
}

function animarRolosCurto(duration = 900, interval = 80) {
    return new Promise(resolve => {
        rolos.forEach(r => r.classList.add('spin'));
        let elapsed = 0;
        const anim = setInterval(() => {
            rolos.forEach(r => {
                const idx = Math.floor(Math.random() * simbolos.length);
                r.textContent = simbolos[idx];
                r.style.transform = `translateY(${Math.random()*18-9}px)`;
            });
            elapsed += interval;
            if (elapsed >= duration) {
                clearInterval(anim);
                rolos.forEach(r => {
                    r.style.transform = 'translateY(0px)';
                    r.classList.remove('spin');
                });
                requestAnimationFrame(() => requestAnimationFrame(resolve));
            }
        }, interval);
    });
}

async function girar() {
    if (girando) return;

    if (essencias <= 0) {
        mensagem.textContent = "Sem tentativas — reiniciando...";
        somFim.currentTime = 0;
        somFim.play();
        await sleep(600);
        resetJogo();
        return;
    }

    bloquearBotao();
    mensagem.textContent = "Girando...";

    somGiro.currentTime = 0;
    somGiro.play();

    essencias--;
    essenciasSpan.textContent = essencias;

    await animarRolosCurto(1000, 80);

    // Para o som de giro
    somGiro.pause();

    const resultado = [];
    for (let i = 0; i < 3; i++) {
        const idx = Math.random() < 0.5 && resultado.length
            ? simbolos.indexOf(resultado[i-1])
            : Math.floor(Math.random() * simbolos.length);
        resultado.push(simbolos[idx]);
        rolos[i].textContent = simbolos[idx];
    }

    if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
        mensagem.textContent = "🏆 Vitória!";
        somVitoria.currentTime = 0;
        somVitoria.play(); // toca som de vitória
        piscarCabine();
        await sleep(1500); // símbolos finais ficam mais tempo apenas na vitória
        resetJogo();
    } else {
        if (essencias <= 0) {
            mensagem.textContent = "💥 Acabaram as tentativas. Reiniciando...";
            somFim.currentTime = 0;
            somFim.play(); // som de derrota
            await sleep(800);
            resetJogo();
        } else {
            mensagem.textContent = "Tente de novo!";
            desbloquearBotao();
        }
    }
}

function piscarCabine() {
    const cabine = document.querySelector('.cabine');
    cabine.animate([
        { boxShadow: '0 12px 36px rgba(255,215,0,0.12)' },
        { boxShadow: '0 40px 90px rgba(255,215,0,0.22)' },
        { boxShadow: '0 12px 36px rgba(255,215,0,0.12)' }
    ], { duration: 600 });
}

function resetJogo() {
    essencias = 5; // reset para 5 tentativas
    essenciasSpan.textContent = essencias;
    rolos.forEach(r => r.textContent = '?');
    mensagem.textContent = "Puxe a alavanca e boa sorte!";
    desbloquearBotao();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

btnGirar.addEventListener('click', e => {
    e.preventDefault();
    girar();
});

window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault();
        girar();
    }
});

desbloquearBotao();
