document.addEventListener("DOMContentLoaded", () => {
    attachTabListeners();
    openLeague("laliga"); // Primera pestaña activa
});

// Botones mapeados a los IDs de contenedor
const leagueIdMap = {
    laliga: "laliga",
    premier: "premier",
    nfl: "nfl",
    tenis: "tenis"
};

// Listener para los botones
function attachTabListeners() {
    const buttons = document.querySelectorAll(".tab-button");

    buttons.forEach(btn => {
        const league = btn.dataset.league;
        btn.addEventListener("click", () => openLeague(league));
    });
}

function openLeague(leagueName) {
    // Desactivar pestañas
    document.querySelectorAll(".tab-button").forEach(btn => {
        btn.classList.remove("active");
    });

    // Activar botón pulsado
    const activeBtn = document.querySelector(`.tab-button[data-league="${leagueName}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    // Ocultar contenedores
    document.querySelectorAll(".league-container").forEach(div => {
        div.classList.remove("active");
    });

    // Mostrar el correcto
    const container = document.getElementById(leagueIdMap[leagueName]);
    container.classList.add("active");

    // Cargar partidos
    loadMatches(leagueName);
}

function loadMatches(leagueName) {
    const container = document.getElementById(leagueIdMap[leagueName]);
    container.innerHTML = "";

    const partidos = partidosData[leagueName];

    partidos.forEach((p, i) => {
        const card = document.createElement("div");
        card.classList.add("match-card");

        const showDraw = p.probE > 0;

        card.innerHTML = `
            <div class="match-header">${p.local} vs ${p.visitante}</div>

            <div class="probability-bar">
                <div class="prob-segment segment-home" id="home-${leagueName}-${i}" style="width:0%">
                    Local ${p.probL}%
                </div>
                ${showDraw ? `
                <div class="prob-segment segment-draw" id="draw-${leagueName}-${i}" style="width:0%">
                    Empate ${p.probE}%
                </div>` : ""}
                <div class="prob-segment segment-away" id="away-${leagueName}-${i}" style="width:0%">
                    Visitante ${p.probV}%
                </div>
            </div>

            <div class="bet-actions">
                <button onclick="apostar('${p.local}')">Apostar a ${p.local}</button>
                ${showDraw ? `<button onclick="apostar('Empate')">Apostar a Empate</button>` : ""}
                <button onclick="apostar('${p.visitante}')">Apostar a ${p.visitante}</button>
            </div>
        `;

        container.appendChild(card);

        setTimeout(() => {
            document.getElementById(`home-${leagueName}-${i}`).style.width = `${p.probL}%`;
            if (showDraw) document.getElementById(`draw-${leagueName}-${i}`).style.width = `${p.probE}%`;
            document.getElementById(`away-${leagueName}-${i}`).style.width = `${p.probV}%`;
        }, 100);
    });
}

function apostar(seleccion) {
    alert("Has apostado por: " + seleccion);
}
