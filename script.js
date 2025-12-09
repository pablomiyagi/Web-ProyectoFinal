// ---------------------------
// DATOS DE LOS PARTIDOS
// ---------------------------
// probL: Probabilidad Local, probE: Empate, probV: Visitante
const partidosData = {
    laliga: [
        { local: "Barcelona", visitante: "Real Madrid", probL: 50, probE: 30, probV: 20 },
        { local: "Sevilla", visitante: "Atlético", probL: 40, probE: 35, probV: 25 },
        { local: "Valencia", visitante: "Villarreal", probL: 33, probE: 33, probV: 34 }
    ],
    premier: [
        { local: "Liverpool", visitante: "Man. United", probL: 55, probE: 25, probV: 20 },
        { local: "Arsenal", visitante: "Chelsea", probL: 50, probE: 30, probV: 20 },
        { local: "Man. City", visitante: "Tottenham", probL: 60, probE: 20, probV: 20 }
    ],
    nfl: [
        { local: "Chiefs", visitante: "Bills", probL: 60, probE: 0, probV: 40 },
        { local: "Eagles", visitante: "Cowboys", probL: 45, probE: 0, probV: 55 },
        { local: "49ers", visitante: "Ravens", probL: 50, probE: 0, probV: 50 }
    ],
    tenis: [
        { local: "Alcaraz", visitante: "Djokovic", probL: 55, probE: 0, probV: 45 },
        { local: "Sinner", visitante: "Nadal", probL: 70, probE: 0, probV: 30 },
        { local: "Medvedev", visitante: "Zverev", probL: 48, probE: 0, probV: 52 }
    ]
};

// ---------------------------
// CAMBIO DE PESTAÑAS
// ---------------------------
function openLeague(leagueName) {
    // 1. Gestionar clases visuales de los botones
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    const activeBtn = [...document.querySelectorAll(".tab-button")]
        .find(btn => btn.onclick.toString().includes(leagueName));
    if(activeBtn) activeBtn.classList.add("active");

    // 2. Ocultar todos los contenedores y mostrar el seleccionado
    document.querySelectorAll(".league-container").forEach(div => div.classList.remove("active"));
    document.getElementById(leagueName).classList.add("active");

    // 3. Cargar los datos
    loadMatches(leagueName);
}

// ---------------------------
// CARGAR PARTIDOS Y ANIMACIONES
// ---------------------------
function loadMatches(leagueName) {
    const container = document.getElementById(leagueName);
    container.innerHTML = ""; // Limpiar contenido anterior

    const partidos = partidosData[leagueName];

    partidos.forEach((p, index) => {
        // Crear tarjeta
        const card = document.createElement("div");
        card.classList.add("match-card");

        // Lógica para ocultar el botón de empate si la probabilidad es 0 (ej. Tenis/NFL)
        const showDraw = p.probE > 0;
        
        // Generar HTML interno
        card.innerHTML = `
            <div class="match-header">
                ${p.local} vs ${p.visitante}
            </div>

            <div class="probability-bar">
                <div class="prob-segment segment-home" id="bar-home-${leagueName}-${index}" style="width: 0%">
                    Local ${p.probL}%
                </div>
                ${showDraw ? `
                <div class="prob-segment segment-draw" id="bar-draw-${leagueName}-${index}" style="width: 0%">
                    Empate ${p.probE}%
                </div>` : ''}
                <div class="prob-segment segment-away" id="bar-away-${leagueName}-${index}" style="width: 0%">
                    Visitante ${p.probV}%
                </div>
            </div>

            <div class="bet-actions">
                <button class="bet-btn" onclick="apostar('${p.local}')">Apostar a ${p.local}</button>
                ${showDraw ? `<button class="bet-btn" onclick="apostar('Empate')">Apostar a Empate</button>` : ''}
                <button class="bet-btn" onclick="apostar('${p.visitante}')">Apostar a ${p.visitante}</button>
            </div>
        `;

        container.appendChild(card);

        // ---------------------------
        // TRIGGER ANIMACIÓN
        // ---------------------------
        // Usamos setTimeout para dar tiempo al navegador a renderizar el ancho 0%
        // y luego aplicar la transición al nuevo ancho.
        setTimeout(() => {
            document.getElementById(`bar-home-${leagueName}-${index}`).style.width = `${p.probL}%`;
            if(showDraw) {
                document.getElementById(`bar-draw-${leagueName}-${index}`).style.width = `${p.probE}%`;
            }
            document.getElementById(`bar-away-${leagueName}-${index}`).style.width = `${p.probV}%`;
        }, 100);
    });
}

function apostar(seleccion) {
    alert(`¡Has apostado por: ${seleccion}! Mucha suerte.`);
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    openLeague('laliga');
});

