// ===============================================
// 1. DATA DE PARTIDOS
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

// Variable para apuestas PENDIENTES (seleccionadas pero no pagadas)
let activeBets = [];

// Variable para apuestas CONFIRMADAS (Historial temporal)
// Al recargar la página, esta variable se vacía automáticamente
let historialSesion = []; 

// ===============================================
// 2. FUNCIONES DE RENDERIZADO
// ===============================================

function createOddsBarHTML(probs, isThreeWay) {
    let html = '';
    if (isThreeWay) {
        html += `<div class="odd-segment local" style="width: ${probs.local}%;">Local ${probs.local}%</div>`;
        html += `<div class="odd-segment draw" style="width: ${probs.draw}%;">Empate ${probs.draw}%</div>`;
        html += `<div class="odd-segment visitor" style="width: ${probs.visitor}%;">Visitante ${probs.visitor}%</div>`;
    } else {
        html += `<div class="odd-segment local" style="width: ${probs.local}%;">Local ${probs.local}%</div>`;
        html += `<div class="odd-segment visitor" style="width: ${probs.visitor}%;">Visitante ${probs.visitor}%</div>`;
    }
    return html;
}

function createBetActionsHTML(match, isThreeWay) {
    let html = '';
    html += `<button class="btn-bet" data-match-id="${match.id}" data-type="local" data-odd="${match.odds.local}">Apostar a ${match.home}</button>`;
    if (isThreeWay) {
        html += `<button class="btn-bet" data-match-id="${match.id}" data-type="draw" data-odd="${match.odds.draw}">Apostar a Empate</button>`;
    }
    html += `<button class="btn-bet" data-match-id="${match.id}" data-type="visitor" data-odd="${match.odds.visitor}">Apostar a ${match.away}</button>`;
    return `<div class="bet-actions">${html}</div>`;
}

function renderMatches(leagueId) {
    const container = document.getElementById(leagueId);
    const leagueMatches = matchData[leagueId];
    if (!container || !leagueMatches) return;

    container.innerHTML = '';
    const isThreeWay = leagueId === 'laliga' || leagueId === 'premier';

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
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active-tab-button'));
    clickedTab.classList.add('active-tab-button');

    document.querySelectorAll('.league-container').forEach(container => {
        container.classList.remove('active');
        container.style.display = 'none';
    });

    const activeContainer = document.getElementById(leagueId);
    if (activeContainer) {
        activeContainer.style.display = 'block';
        activeContainer.classList.add('active');
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
        listContainer.innerHTML = '<p class="placeholder-msg">Selecciona una cuota para apostar.</p>';
        totalInfo.classList.add('hidden');
    } else {
        let totalApuestas = 0;
        let totalMonto = 0;
        let totalGananciaPotencial = 1.0;

        activeBets.forEach((bet, index) => {
            const betItem = document.createElement('div');
            betItem.className = 'bet-item';
            betItem.dataset.id = bet.id;
            
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
            totalGananciaPotencial *= bet.odd;
        });

        totalInfo.classList.remove('hidden');
        totalCount.textContent = totalApuestas;
        totalAmount.textContent = totalMonto.toFixed(2);
        totalPayout.textContent = (totalMonto * totalGananciaPotencial).toFixed(2);

        const balanceSpan = document.getElementById('balance');
        const currentBalance = balanceSpan ? parseFloat(balanceSpan.textContent) : 10000;
        btnPlaceAll.disabled = totalMonto > currentBalance || totalMonto === 0;
    }
}

// --- NUEVA LÓGICA: GESTIÓN DE HISTORIAL TEMPORAL ---

/**
 * Renderiza las apuestas confirmadas leyendo desde la variable 'historialSesion'
 */
function renderConfirmedHistory() {
    // Buscamos el contenedor, si no existe lo creamos dinámicamente
    let historyContainer = document.getElementById('historial-apuestas-container');
    const btnPlaceAll = document.getElementById('btn-place-all');

    if (!historyContainer) {
        // Crear contenedor visual para el historial
        historyContainer = document.createElement('div');
        historyContainer.id = 'historial-apuestas-container';
        historyContainer.style.marginTop = '20px';
        historyContainer.style.borderTop = '1px solid #444';
        historyContainer.style.paddingTop = '10px';
        
        // Insertarlo DESPUÉS del botón de confirmar
        if (btnPlaceAll && btnPlaceAll.parentNode) {
            btnPlaceAll.parentNode.insertAdjacentElement('afterend', historyContainer);
        } else {
            // Fallback por si la estructura cambia
            document.querySelector('.talon-card').appendChild(historyContainer);
        }
    }

    historyContainer.innerHTML = ''; // Limpiar siempre antes de pintar

    if (historialSesion.length === 0) {
        // Si no hay historial en esta sesión, no mostramos nada o mostramos un mensaje vacío
        return; 
    }

    historyContainer.innerHTML = '<h4 style="color:#00ff88; margin-bottom:10px;">📋 Apuestas Realizadas (Sesión)</h4>';

    // Invertir para ver la más reciente primero y dibujar
    [...historialSesion].reverse().forEach(bet => {
        const item = document.createElement('div');
        item.style.cssText = 'background: #222; padding: 8px; margin-bottom: 5px; border-radius: 4px; font-size: 0.8rem; border-left: 3px solid #00ff88;';
        
        let selectionName = bet.type === 'local' ? bet.home : bet.type === 'visitor' ? bet.away : 'Empate';
        
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <strong>${bet.teams}</strong>
                <span>${bet.amount.toFixed(2)}€</span>
            </div>
            <div style="color: #aaa; margin-top:2px;">
                ${selectionName} @ ${bet.odd.toFixed(2)}
            </div>
            <div style="text-align:right; color:#00ff88; font-weight:bold;">
                Potencial: ${(bet.amount * bet.odd).toFixed(2)}€
            </div>
        `;
        historyContainer.appendChild(item);
    });
}

// ------------------------------------------

function handleBetClick(event) {
    const button = event.target;
    if (!button.classList.contains('btn-bet')) return;

    const matchId = parseInt(button.dataset.matchId);
    const betType = button.dataset.type;
    const odd = parseFloat(button.dataset.odd);

    const allMatches = Object.values(matchData).flat();
    const match = allMatches.find(m => m.id === matchId);

    if (!match) return;

    const existingBetIndex = activeBets.findIndex(bet => bet.matchId === matchId);

    if (existingBetIndex !== -1) {
        const existingBet = activeBets[existingBetIndex];
        if (existingBet.type === betType) return;

        existingBet.type = betType;
        existingBet.odd = odd;
    } else {
        activeBets.push({
            id: Date.now(),
            matchId: matchId,
            teams: match.teams,
            home: match.home,
            away: match.away,
            type: betType,
            odd: odd,
            amount: 10.00
        });
    }

    updateBetPanel();
}

function handleRemoveBet(event) {
    const button = event.target;
    if (!button.classList.contains('remove-btn')) return;
    const indexToRemove = parseInt(button.dataset.index);
    activeBets.splice(indexToRemove, 1);
    updateBetPanel();
}

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
    // 1. Inicializar partidos
    renderMatches('laliga');

    // 2. Event Listeners
    document.querySelector('.tabs').addEventListener('click', handleTabClick);
    document.querySelector('.apuestas-content').addEventListener('click', handleBetClick); 
    
    const apuestasList = document.getElementById('apuestas-list');
    if(apuestasList){
        apuestasList.addEventListener('click', handleRemoveBet);
        apuestasList.addEventListener('input', handleAmountChange);
    }

    // 3. NO CARGAMOS HISTORIAL AL INICIO (Para que empiece vacío al refrescar)

    // 4. BOTÓN CONFIRMAR (MODIFICADO SIN LOCALSTORAGE)
    const btnPlaceAll = document.getElementById('btn-place-all');
    if (btnPlaceAll) {
        btnPlaceAll.addEventListener('click', () => {
            if (activeBets.length === 0) return;

            const totalAmount = activeBets.reduce((sum, bet) => sum + bet.amount, 0);
            
            // Simular deducción de saldo
            const balanceSpan = document.getElementById('balance');
            let currentBalance = parseFloat(balanceSpan.textContent);
            
            if (currentBalance < totalAmount) {
                alert("Saldo insuficiente");
                return;
            }

            // --- AQUÍ OCURRE EL CAMBIO ---
            // En lugar de guardar en Storage, guardamos en el array temporal 'historialSesion'
            const betsToMove = activeBets.map(bet => ({...bet}));
            
            // Añadir al historial temporal
            historialSesion = [...historialSesion, ...betsToMove];
            
            // Actualizar Saldo
            balanceSpan.textContent = (currentBalance - totalAmount).toFixed(2);
            
            alert(`¡Apuestas confirmadas!`);
            
            // Limpiar apuestas pendientes
            activeBets = []; 
            updateBetPanel(); // Esto limpia la parte de arriba
            
            // Pintar el historial abajo
            renderConfirmedHistory(); 
        });
    }
});
