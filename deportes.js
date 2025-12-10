// =======================================================
// deportes.js (Lógica de Pestañas y Generación de Partidos)
// REQUIERE: partidosData.js cargado previamente.
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar datos en los contenedores al inicio
    loadAllLeagues();

    // 2. Inicializar la primera pestaña
    openLeague('LaLiga');
});


const leagueIdMap = {
    'LaLiga': 'laliga',
    'Premier League': 'premier',
    'NFL': 'nfl',
    'Wimbledon': 'tenis'
};

/**
 * Función para generar el HTML de un solo partido.
 */
function createMatchCard(match) {
    let html = `
        <div class="match-card" data-match="${match.partido}" data-id="${match.id}">
            <div class="match-header">${match.partido}</div>
            <div class="probability-bar">
    `;

    let betButtonsHtml = '';

    // Itera sobre las probabilidades (Local, Empate, Visitante)
    for (const key in match.probabilidades) {
        const prob = match.probabilidades[key];
        const odds = match.cuotas_ejemplo[key]; 
        
        let segmentClass = '';
        if (prob.color === 'green') segmentClass = 'segment-home';
        else if (prob.color === 'orange') segmentClass = 'segment-draw';
        else if (prob.color === 'red') segmentClass = 'segment-away';
        
        // Segmento de la barra
        html += `
            <div class="prob-segment ${segmentClass}" style="width: ${prob.porcentaje};">${prob.seleccion} ${prob.porcentaje}</div>
        `;
        
        // Botón de apuesta (contiene data-* para apuestas.js)
        betButtonsHtml += `
            <button class="bet-btn" 
                data-id="${match.id}"
                data-result="${key}" 
                data-selection="${prob.seleccion}" 
                data-odds="${odds}">
                Apostar a ${prob.seleccion} (${odds.toFixed(2)})
            </button>
        `;
    }
    
    html += `
            </div>
            <div class="bet-actions">
                ${betButtonsHtml}
            </div>
        </div>
    `;

    return html;
}

/**
 * Carga todos los partidos del objeto 'partidosData' en sus respectivos contenedores HTML.
 */
function loadAllLeagues() {
    // Verificar que partidosData esté disponible
    if (typeof partidosData === 'undefined') {
        console.error("Error: La variable partidosData no está definida. Asegúrate de cargar partidosData.js antes de deportes.js");
        return;
    }

    for (const leagueName in partidosData) {
        const leagueData = partidosData[leagueName];
        const containerId = leagueIdMap[leagueName];
        const container = document.getElementById(containerId);
        
        if (container && leagueData) {
            let leagueHtml = '';
            leagueData.forEach(match => {
                leagueHtml += createMatchCard(match);
            });
            container.innerHTML = leagueHtml;
        }
    }
}

/**
 * Función para cambiar la pestaña activa y mostrar el contenido de la liga seleccionada.
 */
function openLeague(leagueName) {
    const containerId = leagueIdMap[leagueName];

    // Ocultar todos los contenedores de liga
    document.querySelectorAll('.league-container').forEach(container => {
        container.classList.remove('active');
    });

    // Desactivar todos los botones de pestaña
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar el contenedor de la liga seleccionada
    const activeContainer = document.getElementById(containerId);
    if (activeContainer) {
        activeContainer.classList.add('active');
    }

    // Activar el botón de pestaña
    const activeButton = document.querySelector(`.tab-button[onclick*="'${leagueName}'"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

window.openLeague = openLeague;