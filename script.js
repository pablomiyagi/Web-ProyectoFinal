// ===============================================
// 1. DATA DE PARTIDOS (Basada en las imágenes)
// ===============================================

const matchData = {
    laliga: [
        { id: 1, teams: 'Barcelona vs Real Madrid', home: 'Barcelona', away: 'Real Madrid', odds: { local: 1.50, draw: 3.33, visitor: 5.00 }, probs: { local: 50, draw: 30, visitor: 20 } },
        { id: 2, teams: 'Sevilla vs Atlético', home: 'Sevilla', away: 'Atlético', odds: { local: 2.50, draw: 2.85, visitor: 4.00 }, probs: { local: 40, draw: 35, visitor: 25 } },
        { id: 3, teams: 'Valencia vs Villarreal', home: 'Valencia', away: 'Villarreal', odds: { local: 3.03, draw: 3.03, visitor: 2.94 }, probs: { local: 33, draw: 33, visitor: 34 } },
    ],
    premier: [
        { id: 4, teams: 'Liverpool vs Man. United', home: 'Liverpool', away: 'Man. United', odds: { local: 1.81, draw: 4.00, visitor: 5.00 }, probs: { local: 55, draw: 25, visitor: 20 } },
        { id: 5, teams: 'Arsenal vs Chelsea', home: 'Arsenal', away: 'Chelsea', odds: { local: 2.00, draw: 3.33, visitor: 5.00 }, probs: { local: 50, draw: 30, visitor: 20 } },
        { id: 6, teams: 'Man. City vs Tottenham', home: 'Man. City', away: 'Tottenham', odds: { local: 1.43, draw: 5.00, visitor: 10.00 }, probs: { local: 60, draw: 20, visitor: 20 } },
    ],
    nfl: [
        { id: 7, teams: 'Chiefs vs Bills', home: 'Chiefs', away: 'Bills', odds: { local: 1.66, draw: null, visitor: 2.50 }, probs: { local: 60, draw: 0, visitor: 40 } },
        { id: 8, teams: 'Eagles vs Cowboys', home: 'Eagles', away: 'Cowboys', odds: { local: 2.22, draw: null, visitor: 1.81 }, probs: { local: 45, draw: 0, visitor: 55 } },
        { id: 9, teams: '49ers vs Ravens', home: '49ers', away: 'Ravens', odds: { local: 2.00, draw: null, visitor: 2.00 }, probs: { local: 50, draw: 0, visitor: 50 } },
    ],
    tenis: [
        { id: 10, teams: 'Alcaraz vs Djokovic', home: 'Alcaraz', away: 'Djokovic', odds: { local: 1.92, draw: null, visitor: 2.32 }, probs: { local: 57, draw: 0, visitor: 43 } },
        { id: 11, teams: 'Sinner vs Nadal', home: 'Sinner', away: 'Nadal', odds: { local: 1.42, draw: null, visitor: 3.33 }, probs: { local: 70, draw: 0, visitor: 30 } },
        { id: 12, teams: 'Medvedev vs Zverev', home: 'Medvedev', away: 'Zverev', odds: { local: 2.08, draw: null, visitor: 1.92 }, probs: { local: 48, draw: 0, visitor: 52 } },
    ]
};

// Variable para almacenar las apuestas activas
let activeBets = [];

// ===============================================
// 2. FUNCIONES DE RENDERIZADO
// ===============================================

/**
 * Genera el HTML para la barra de probabilidades.
 * @param {object} probs - Objeto con probabilidades (local, draw, visitor).
 * @param {boolean} isThreeWay - Indica si es un evento con empate (fútbol) o no (NFL/Tenis).
 * @returns {string} HTML de la barra.
 */
function createOddsBarHTML(probs, isThreeWay) {
    let html = '';

    // Si es ThreeWay (Fútbol)
    if (isThreeWay) {
        html += `<div class="odd-segment local" style="width: ${probs.local}%;">Local ${probs.local}%</div>`;
        html += `<div class="odd-segment draw" style="width: ${probs.draw}%;">Empate ${probs.draw}%</div>`;
        html += `<div class="odd-segment visitor" style="width: ${probs.visitor}%;">Visitante ${probs.visitor}%</div>`;
    } else {
        // TwoWay (NFL/Tenis) - solo Local y Visitante
        html += `<div class="odd-segment local" style="width: ${probs.local}%;">Local ${probs.local}%</div>`;
        html += `<div class="odd-segment visitor" style="width: ${probs.visitor}%;">Visitante ${probs.visitor}%</div>`;
    }
    return html;
}

/**
 * Genera el HTML de los botones de apuesta.
 * @param {object} match - Objeto de partido.
 * @param {boolean} isThreeWay - Si incluye botón de empate.
 * @returns {string} HTML de los botones.
 */
function createBetActionsHTML(match, isThreeWay) {
    let html = '';

    // Botón Local
    html += `<button class="btn-bet" data-match-id="${match.id}" data-type="local" data-odd="${match.odds.local}">Apostar a ${match.home}</button>`;

    // Botón Empate (solo si existe)
    if (isThreeWay) {
        html += `<button class="btn-bet" data-match-id="${match.id}" data-type="draw" data-odd="${match.odds.draw}">Apostar a Empate</button>`;
    }

    // Botón Visitante
    html += `<button class="btn-bet" data-match-id="${match.id}" data-type="visitor" data-odd="${match.odds.visitor}">Apostar a ${match.away}</button>`;

    return `<div class="bet-actions">${html}</div>`;
}

/**
 * Renderiza todos los partidos de una liga en su contenedor.
 * @param {string} leagueId - ID de la liga a renderizar (ej. 'laliga').
 */
function renderMatches(leagueId) {
    const container = document.getElementById(leagueId);
    const leagueMatches = matchData[leagueId];
    if (!container || !leagueMatches) return;

    container.innerHTML = '';
    const isThreeWay = leagueId === 'laliga' || leagueId === 'premier'; // Solo fútbol tiene empate

    leagueMatches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        matchCard.innerHTML = `
            <h3 class="match-title">${match.teams}</h3>
            <div class="match-odds-bar">
                ${createOddsBarHTML(match.probs, isThreeWay)}
            </div>
            ${createBetActionsHTML(match, isThreeWay)}
        `;
        container.appendChild(matchCard);
    });
}

// ===============================================
// 3. LÓGICA DE PESTAÑAS (TABS)
// ===============================================

function handleTabClick(event) {
    const clickedTab = event.target;
    if (!clickedTab.classList.contains('tab-button')) return;

    const leagueId = clickedTab.dataset.league;

    // 1. Manejar clases activas de pestañas
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active-tab-button');
    });
    clickedTab.classList.add('active-tab-button');

    // 2. Ocultar todos los contenedores y mostrar el correcto
    document.querySelectorAll('.league-container').forEach(container => {
        container.classList.remove('active');
        container.style.display = 'none';
    });

    const activeContainer = document.getElementById(leagueId);
    if (activeContainer) {
        activeContainer.style.display = 'block'; // Mostrar el contenedor
        activeContainer.classList.add('active');
        
        // 3. Renderizar los partidos (si no se han renderizado antes)
        if (activeContainer.children.length === 0) {
            renderMatches(leagueId);
        }
    }
}

// ===============================================
// 4. LÓGICA DE APUESTAS (PANEL LATERAL)
// ===============================================

function updateBetPanel() {
    const listContainer = document.getElementById('apuestas-list');
    const totalInfo = document.getElementById('total-info');
    const totalCount = document.getElementById('total-count');
    const totalAmount = document.getElementById('total-amount');
    const totalPayout = document.getElementById('total-payout');
    const btnPlaceAll = document.getElementById('btn-place-all');

    listContainer.innerHTML = '';

    if (activeBets.length === 0) {
        listContainer.innerHTML = '<p class="placeholder-msg">Haz clic en \'Apostar a...\'' + ' para empezar.</p>';
        totalInfo.classList.add('hidden');
        return;
    }

    let totalApuestas = 0;
    let totalMonto = 0;
    let totalGananciaPotencial = 1.0; // Para el cálculo de la parlay (combinada)

    activeBets.forEach((bet, index) => {
        const betItem = document.createElement('div');
        betItem.className = 'bet-item';
        betItem.dataset.id = bet.id;
        
        // Determinar el nombre de la selección
        let selectionName = bet.type === 'local' ? bet.home : bet.type === 'visitor' ? bet.away : 'Empate';

        betItem.innerHTML = `
            <div>
                <strong>${bet.teams}</strong>
                <p>Selección: ${selectionName} (Cuota: ${bet.odd.toFixed(2)})</p>
                <p>Monto: <input type="number" min="0.01" value="${bet.amount.toFixed(2)}" data-index="${index}" class="bet-amount-input" />€</p>
            </div>
            <button class="remove-btn" data-index="${index}">&times;</button>
        `;
        listContainer.appendChild(betItem);

        totalApuestas++;
        totalMonto += bet.amount;
        totalGananciaPotencial *= bet.odd; // Multiplicar cuotas para la combinada
    });

    // Actualizar Totales
    totalInfo.classList.remove('hidden');
    totalCount.textContent = totalApuestas;
    totalAmount.textContent = totalMonto.toFixed(2);
    // Ganancia Potencial (Monto total x Cuota combinada)
    totalPayout.textContent = (totalMonto * totalGananciaPotencial).toFixed(2);

    // Habilitar botón si hay saldo y apuestas
    const currentBalance = parseFloat(document.getElementById('balance').textContent);
    btnPlaceAll.disabled = totalMonto > currentBalance || totalMonto === 0;
}

/**
 * Añade una apuesta al talón (o la actualiza si ya existe).
 */
function handleBetClick(event) {
    const button = event.target;
    if (!button.classList.contains('btn-bet')) return;

    const matchId = parseInt(button.dataset.matchId);
    const betType = button.dataset.type;
    const odd = parseFloat(button.dataset.odd);

    // Encontrar el partido completo
    const allMatches = Object.values(matchData).flat();
    const match = allMatches.find(m => m.id === matchId);

    if (!match) return;

    // Verificar si ya existe una apuesta para este partido
    const existingBetIndex = activeBets.findIndex(bet => bet.matchId === matchId);

    if (existingBetIndex !== -1) {
        // Ya existe una apuesta para este partido: solo actualizar la selección y cuota
        const existingBet = activeBets[existingBetIndex];

        if (existingBet.type === betType) {
            // Si hacen clic en la misma selección, no hacemos nada (o podríamos eliminarla, pero actualizar es más simple)
            return;
        }

        // Actualizar la apuesta existente con la nueva selección
        existingBet.type = betType;
        existingBet.odd = odd;
        
        // Mostrar advertencia (simulación de límite de apuesta)
        document.getElementById('limit-warning').style.display = 'block';
        setTimeout(() => {
             document.getElementById('limit-warning').style.display = 'none';
        }, 3000);

    } else {
        // No existe: añadir nueva apuesta
        activeBets.push({
            id: Date.now(), // ID único para la apuesta
            matchId: matchId,
            teams: match.teams,
            home: match.home,
            away: match.away,
            type: betType, // 'local', 'draw', 'visitor'
            odd: odd,
            amount: 10.00 // Monto por defecto
        });
    }

    updateBetPanel();
}

/**
 * Maneja la eliminación de una apuesta del panel.
 */
function handleRemoveBet(event) {
    const button = event.target;
    if (!button.classList.contains('remove-btn')) return;

    const indexToRemove = parseInt(button.dataset.index);
    activeBets.splice(indexToRemove, 1);

    updateBetPanel();
}

/**
 * Maneja la edición del monto de apuesta en el panel.
 */
function handleAmountChange(event) {
    const input = event.target;
    if (!input.classList.contains('bet-amount-input')) return;

    const index = parseInt(input.dataset.index);
    let newAmount = parseFloat(input.value);

    if (isNaN(newAmount) || newAmount <= 0) {
        newAmount = 0.01;
        input.value = newAmount.toFixed(2);
    }

    activeBets[index].amount = newAmount;
    updateBetPanel();
}


// ===============================================
// 5. INICIALIZACIÓN DE EVENTOS
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar la primera pestaña (LaLiga)
    renderMatches('laliga');

    // 2. Agregar listeners a las pestañas
    document.querySelector('.tabs').addEventListener('click', handleTabClick);

    // 3. Agregar listeners a los botones de apuesta (delegación de eventos en main-layout)
    document.querySelector('.apuestas-content').addEventListener('click', handleBetClick);

    // 4. Agregar listeners al panel de apuestas
    document.getElementById('apuestas-list').addEventListener('click', handleRemoveBet);
    document.getElementById('apuestas-list').addEventListener('input', handleAmountChange);

    // 5. Listener para el botón de confirmar (Simulación)
    document.getElementById('btn-place-all').addEventListener('click', () => {
        const totalAmount = activeBets.reduce((sum, bet) => sum + bet.amount, 0);
        alert(`¡Apuestas confirmadas! Se han apostado ${totalAmount.toFixed(2)}€.`);
        activeBets = []; // Limpiar apuestas
        updateBetPanel();
        
        // Simular deducción de saldo
        const balanceSpan = document.getElementById('balance');
        let currentBalance = parseFloat(balanceSpan.textContent);
        balanceSpan.textContent = (currentBalance - totalAmount).toFixed(2);
    });
});