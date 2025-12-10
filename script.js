// =======================================================
// apuestas.js (Lógica para gestionar el talón de apuestas)
// =======================================================

let currentBets = []; // Array para almacenar las apuestas activas
const apuestasList = document.getElementById('apuestas-list');
const totalInfoDiv = document.getElementById('total-info');
const totalCountSpan = document.getElementById('total-count');
const totalAmountSpan = document.getElementById('total-amount');
const totalPayoutSpan = document.getElementById('total-payout');
const btnPlaceAll = document.getElementById('btn-place-all');

// ------------------------------------
// FUNCIONES DE UTILIDAD
// ------------------------------------

/**
 * Genera un ID único para la apuesta.
 */
function generateBetId(matchId, betResult) {
    // Combina el ID único del partido con el resultado (Local, Empate, Visitante)
    return `${matchId}_${betResult}`;
}

/**
 * Actualiza el resumen de totales (cantidad de apuestas, monto total, ganancia potencial).
 */
function updateTotals() {
    if (currentBets.length === 0) {
        // Muestra el mensaje de marcador de posición si no hay apuestas
        if (totalInfoDiv) totalInfoDiv.classList.add('hidden');
        if (apuestasList) apuestasList.innerHTML = '<p class="placeholder-msg">Haz clic en \'Apostar a...\' para empezar.</p>';
        if (btnPlaceAll) btnPlaceAll.disabled = true;
        return;
    }

    let totalAmount = 0;
    let combinedOdds = 1.0; 
    
    // Si tienes múltiples apuestas, se asume que es una apuesta combinada (parlay)
    currentBets.forEach(bet => {
        totalAmount += parseFloat(bet.monto); 
        combinedOdds *= parseFloat(bet.odds);
    });

    if (totalInfoDiv) totalInfoDiv.classList.remove('hidden');
    if (totalCountSpan) totalCountSpan.textContent = currentBets.length;
    // En una combinada, el monto total es la suma de los montos individuales (simplificado) o un monto único.
    // Aquí usamos la suma para el monto total visible y las cuotas multiplicadas.
    if (totalAmountSpan) totalAmountSpan.textContent = totalAmount.toFixed(2);
    
    // Ganancia potencial (multiplicando cuotas)
    if (totalPayoutSpan) totalPayoutSpan.textContent = (currentBets[0].monto * combinedOdds).toFixed(2); 
    if (btnPlaceAll) btnPlaceAll.disabled = false;
}

/**
 * Renderiza la lista de apuestas en el panel lateral.
 */
function renderApuestasPanel() {
    if (!apuestasList) return;
    apuestasList.innerHTML = '';

    currentBets.forEach(bet => {
        const betDiv = document.createElement('div');
        betDiv.classList.add('bet-item');
        betDiv.setAttribute('data-id', bet.id);
        
        betDiv.innerHTML = `
            <p><strong>${bet.partido}</strong></p>
            <p class="selection-detail">${bet.selection} <span class="odds-display">(${bet.odds.toFixed(2)})</span></p>
            <div class="bet-input-group">
                <label for="amount-${bet.id}">Monto (€):</label>
                <input type="number" id="amount-${bet.id}" 
                    value="${bet.monto.toFixed(2)}" min="0.50" step="0.50" 
                    data-id="${bet.id}" class="bet-amount-input">
                <button class="btn-remove-bet" data-id="${bet.id}">X</button>
            </div>
        `;
        apuestasList.appendChild(betDiv);
    });
    
    // Añadir event listeners a los inputs y botones de eliminar
    document.querySelectorAll('.bet-amount-input').forEach(input => {
        input.addEventListener('input', updateBetAmount);
    });

    document.querySelectorAll('.btn-remove-bet').forEach(button => {
        button.addEventListener('click', (e) => removeBet(e.target.dataset.id));
    });

    updateTotals();
}

/**
 * Elimina una apuesta.
 */
function removeBet(idToRemove) {
    currentBets = currentBets.filter(bet => bet.id !== idToRemove);
    renderApuestasPanel();
}

/**
 * Actualiza el monto de una apuesta individual.
 */
function updateBetAmount(e) {
    const id = e.target.dataset.id;
    let newAmount = parseFloat(e.target.value);
    
    if (isNaN(newAmount) || newAmount < 0.50) {
        newAmount = 0.50; 
        e.target.value = newAmount.toFixed(2);
    }
    
    const betIndex = currentBets.findIndex(bet => bet.id === id);
    if (betIndex !== -1) {
        currentBets[betIndex].monto = newAmount;
        updateTotals(); 
    }
}


// ----------------------------------------------------
// EVENT LISTENER PRINCIPAL
// ----------------------------------------------------

document.addEventListener('click', (e) => {
    // Escucha los clics en los botones de "Apostar" generados por deportes.js
    if (e.target.classList.contains('bet-btn')) {
        const btn = e.target;
        
        const partido = btn.closest('.match-card').dataset.match;
        const matchId = btn.closest('.match-card').dataset.id; 
        const selection = btn.dataset.selection;
        const odds = parseFloat(btn.dataset.odds);
        const betResult = btn.dataset.result; 
        
        const newBet = {
            id: generateBetId(matchId, betResult),
            partido: partido,
            selection: selection,
            odds: odds,
            monto: 5.00 
        };
        
        // Evitar duplicados
        const existingIndex = currentBets.findIndex(bet => bet.id === newBet.id);
        
        if (existingIndex === -1) {
            currentBets.push(newBet);
        } else {
            alert(`¡El pronóstico "${selection}" para "${partido}" ya está en tu talón!`);
            return;
        }

        renderApuestasPanel();
    }
});

// Event listener para el botón final de "Apostar" (simulación)
if (btnPlaceAll) {
    btnPlaceAll.addEventListener('click', () => {
        if (currentBets.length > 0) {
            alert(`¡Apuestas realizadas con éxito! Total apostado: €${totalAmountSpan.textContent}. Ganancia potencial: €${totalPayoutSpan.textContent}.`);
            currentBets = []; 
            renderApuestasPanel();
        } else {
            alert("Tu talón de apuestas está vacío.");
        }
    });
}

// Inicializar el panel de apuestas al cargar
document.addEventListener('DOMContentLoaded', renderApuestasPanel);