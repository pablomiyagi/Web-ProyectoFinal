function apostar(equipo) {
    alert(`Has apostado por: ${equipo}. ¡Buena suerte!`);
}

function mostrarMensaje() {
    alert("¡Gracias por visitar BetMaster! Comienza a apostar ahora.");
}

// Tabs de ligas
function openLeague(league) {
    const leagues = document.querySelectorAll('.league');
    const buttons = document.querySelectorAll('.tab-button');

    leagues.forEach(l => l.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));

    document.getElementById(league).classList.add('active');
    document.querySelector(`.tab-button[onclick="openLeague('${league}')"]`).classList.add('active');
}

// Datos de partidos semanales
const partidosLaLiga = [
    { local: 'Barcelona', visitante: 'Real Madrid', home: 50, draw: 30, away: 20 },
    { local: 'Sevilla', visitante: 'Atlético', home: 40, draw: 35, away: 25 }
];

const partidosPremier = [
    { local: 'Liverpool', visitante: 'Manchester United', home: 55, draw: 25, away: 20 },
    { local: 'Arsenal', visitante: 'Chelsea', home: 50, draw: 30, away: 20 }
];

function renderPartidos() {
    const laligaDiv = document.getElementById('laliga');
    const premierDiv = document.getElementById('premier');

    partidosLaLiga.forEach(p => {
        laligaDiv.innerHTML += `
        <div class="match-card">
            <h3>${p.local} vs ${p.visitante}</h3>
            <div class="progress-container">
                <div class="progress-bar home" style="width:${p.home}%">Local ${p.home}%</div>
                <div class="progress-bar draw" style="width:${p.draw}%">Empate ${p.draw}%</div>
                <div class="progress-bar away" style="width:${p.away}%">Visitante ${p.away}%</div>
            </div>
            <button onclick="apostar('${p.local}')">Apostar a ${p.local}</button>
            <button onclick="apostar('Empate')">Apostar a Empate</button>
            <button onclick="apostar('${p.visitante}')">Apostar a ${p.visitante}</button>
        </div>`;
    });

    partidosPremier.forEach(p => {
        premierDiv.innerHTML += `
        <div class="match-card">
            <h3>${p.local} vs ${p.visitante}</h3>
            <div class="progress-container">
                <div class="progress-bar home" style="width:${p.home}%">Local ${p.home}%</div>
                <div class="progress-bar draw" style="width:${p.draw}%">Empate ${p.draw}%</div>
                <div class="progress-bar away" style="width:${p.away}%">Visitante ${p.away}%</div>
            </div>
            <button onclick="apostar('${p.local}')">Apostar a ${p.local}</button>
            <button onclick="apostar('Empate')">Apostar a Empate</button>
            <button onclick="apostar('${p.visitante}')">Apostar a ${p.visitante}</button>
        </div>`;
    });
}

// Cargar partidos al iniciar la página
document.addEventListener('DOMContentLoaded', renderPartidos);
