// --- CONFIGURACIÓN RUEDA AMERICANA ---
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const mainBettingGrid = document.getElementById("mainBettingGrid");
// Intentar leer saldo del HTML, si no existe o es texto, usar 10000 por defecto
let currentBalance = 10000;
const balanceEl = document.getElementById("balance");
if (balanceEl) {
    const parsed = parseInt(balanceEl.innerText);
    if (!isNaN(parsed)) currentBalance = parsed;
}

let currentChipValue = 100;
let currentRotation = 0;
let bets = {};

// Orden estándar de la rueda (0 y 00 opuestos)
const numbers = [0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, '00', 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2];

// --- JSON ESTADÍSTICAS ---
let rouletteData = JSON.parse(localStorage.getItem("rouletteStats")) || {
    numbers: numbers.map(n => ({ num: n, count: 0 })),
    stats: { hotNumbers: [], coldNumbers: [] }
};

// --- HELPERS ---
function getNumberColor(num) {
    if (num === 0 || num === '00') return "#00cc66"; // Verde
    const redNums = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const n = parseInt(num);
    return redNums.includes(n) ? "#d32f2f" : "#222";
}

// --- DIBUJAR RUEDA ---
function drawWheel() {
    if (!canvas || !ctx) return;
    const arcSize = (2 * Math.PI) / numbers.length;
    const cx = canvas.width / 2, cy = canvas.height / 2, r = canvas.width / 2 - 10;

    for (let i = 0; i < numbers.length; i++) {
        const angle = i * arcSize;
        ctx.beginPath();
        ctx.fillStyle = getNumberColor(numbers[i]);
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + arcSize);
        ctx.fill();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(numbers[i], r - 10, 5);
        ctx.restore();
    }
}

// --- TABLERO DINÁMICO ---
function generateBoardLayout() {
    if (!mainBettingGrid) return;
    const columnNumbers = [];
    for (let i = 1; i <= 36; i++) columnNumbers.push(i);
    let gridHTML = '';
    for (let row = 0; row < 12; row++) {
        const num1 = columnNumbers[row]; // Columna 1 real (1, 4, 7...)
        const num2 = columnNumbers[row + 12]; // Columna 2
        const num3 = columnNumbers[row + 24]; // Columna 3

        // NOTA: Ajusta el orden de visualización si tus columnas se ven raras, 
        // pero matemáticamente esta es la distribución estándar.
        gridHTML += `
            <div class="bet-spot ${getNumberColor(num1) === '#d32f2f' ? 'bg-red' : 'bg-black'}" data-bet="${num1}" id="spot-${num1}" onclick="placeBet('${num1}')">${num1}<div class="chip-stack" id="bet-${num1}"></div></div>
            <div class="bet-spot ${getNumberColor(num2) === '#d32f2f' ? 'bg-red' : 'bg-black'}" data-bet="${num2}" id="spot-${num2}" onclick="placeBet('${num2}')">${num2}<div class="chip-stack" id="bet-${num2}"></div></div>
            <div class="bet-spot ${getNumberColor(num3) === '#d32f2f' ? 'bg-red' : 'bg-black'}" data-bet="${num3}" id="spot-${num3}" onclick="placeBet('${num3}')">${num3}<div class="chip-stack" id="bet-${num3}"></div></div>
            <div class="bet-spot column-bet" data-bet="col${(row % 3) + 1}" id="spot-col${(row % 3) + 1}-${row}" onclick="placeBet('col${(row % 3) + 1}')">2-1<div class="chip-stack" id="bet-col${(row % 3) + 1}"></div></div>
        `;
    }
    mainBettingGrid.innerHTML = gridHTML;
}

// --- SELECCIONAR FICHA ---
function selectChip(value) {
    currentChipValue = value;
    document.querySelectorAll(".chip-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = [...document.querySelectorAll(".chip-btn")].find(b => (b.textContent == value) || (value >= 1000 && b.textContent.includes(value / 1000 + 'K')));
    if (activeBtn) activeBtn.classList.add("active");
    const msgArea = document.getElementById("msg-area");
    if (msgArea) msgArea.innerText = `Ficha seleccionada: ${value}€`;
}

// --- COLOCAR APUESTA ---
window.placeBet = function(spot) {
    if (!bets[spot]) bets[spot] = 0;
    
    if (currentBalance < currentChipValue) {
        alert("Saldo insuficiente");
        return;
    }

    bets[spot] += currentChipValue;
    currentBalance -= currentChipValue;
    document.getElementById("balance").innerText = currentBalance;
    
    const msgArea = document.getElementById("msg-area");
    if (msgArea) msgArea.innerText = `Apostando ${currentChipValue}€ en ${spot}...`;
    
    const chipEl = document.getElementById(`bet-${spot}`);
    if (chipEl) {
        chipEl.className = 'chip-stack';
        chipEl.classList.add(`chip-visual-${currentChipValue}`);
        let display = currentChipValue >= 1000 ? (currentChipValue / 1000) + 'K' : currentChipValue;
        chipEl.innerText = display;
        chipEl.classList.add("active");
    }
};

// --- BORRAR APUESTAS ---
function clearBets() {
    let returned = 0;
    for (let spot in bets) {
        returned += bets[spot];
        const chipEl = document.getElementById(`bet-${spot}`);
        if (chipEl) {
            chipEl.innerText = '';
            chipEl.className = 'chip-stack';
            chipEl.classList.remove("active");
        }
    }
    currentBalance += returned;
    bets = {};
    document.getElementById("balance").innerText = currentBalance;
    const msgArea = document.getElementById("msg-area");
    if (msgArea) msgArea.innerText = "Apuestas borradas (UNDO)";
}

// --- ESTADÍSTICAS ---
function updateNumberStats(winningNum) {
    if (winningNum !== -1) {
        const numberObj = rouletteData.numbers.find(n => n.num == winningNum);
        if (numberObj) numberObj.count++;
    }

    const sorted = [...rouletteData.numbers].sort((a, b) => b.count - a.count);
    rouletteData.stats.hotNumbers = sorted.slice(0, 5);
    rouletteData.stats.coldNumbers = sorted.slice(-5);

    localStorage.setItem("rouletteStats", JSON.stringify(rouletteData));

    const hotDiv = document.getElementById("hotNumbers");
    const coldDiv = document.getElementById("coldNumbers");
    
    if (hotDiv) hotDiv.innerHTML = '';
    if (coldDiv) coldDiv.innerHTML = '';

    if (hotDiv) {
        rouletteData.stats.hotNumbers.forEach(n => {
            const div = document.createElement("div");
            div.className = "stats-item " + (getNumberColor(n.num) === "#d32f2f" ? "red" : (n.num === 0 || n.num === '00' ? "green" : "black"));
            div.textContent = `${n.num} (${n.count})`;
            hotDiv.appendChild(div);
        });
    }

    if (coldDiv) {
        rouletteData.stats.coldNumbers.forEach(n => {
            const div = document.createElement("div");
            div.className = "stats-item " + (getNumberColor(n.num) === "#d32f2f" ? "red" : (n.num === 0 || n.num === '00' ? "green" : "black"));
            div.textContent = `${n.num} (${n.count})`;
            coldDiv.appendChild(div);
        });
    }
}

// =========================================================
// AQUÍ ESTÁ LA CALIBRACIÓN FINAL Y EXACTA (90 GRADOS)
// =========================================================
function calculateResult(actualDeg) {
    if (!Array.isArray(numbers) || numbers.length === 0) return;

    // 1. Tamaño de cada gajo
    const sliceAngle = 360 / numbers.length;

    // 2. Grados normalizados (0-360)
    const normalizedDeg = (actualDeg % 360 + 360) % 360;

    // 3. CALIBRACIÓN: OFFSET DE 90 GRADOS
    // Esto corrige la diferencia entre el 0 del Canvas (Derecha) y la Flecha (Arriba)
    const offset = 90; 

    // 4. Cálculo del índice invertido (porque la rueda gira antihorario en CSS)
    let rawIndex = Math.floor((360 - ((normalizedDeg + offset) % 360)) / sliceAngle);

    // 5. Ajuste final de índice
    let index = rawIndex % numbers.length;

    // 6. Obtener número ganador
    const winningNum = numbers[index];

    // Debug
    console.log(`Giro: ${normalizedDeg.toFixed(2)} | Offset: ${offset} | Ganador: ${winningNum}`);

    // Mostrar mensaje
    const msgArea = document.getElementById("msg-area");
    if (msgArea) {
        const color = getNumberColor(winningNum);
        const colorName = color === "#d32f2f" ? "ROJO" : (color === "#222" ? "NEGRO" : "VERDE");
        msgArea.innerHTML = `¡RESULTADO: <b style="color:${color}; font-size:1.3em;">${winningNum}</b> (${colorName})!`;
    }

    // Actualizar estadísticas
    updateNumberStats(winningNum);
    
    // (Opcional) Aquí llamarías a la función de pagar apuestas si la tuvieras
    // payWinnings(winningNum);
}

// --- GIRAR ---
const spinBtn = document.getElementById("spinBtn");
if (spinBtn) {
    spinBtn.addEventListener("click", () => {
        // Verificar apuestas (opcional, comentado para pruebas rápidas)
        // if(Object.keys(bets).length === 0){ document.getElementById("msg-area").innerText="¡Pon una ficha primero!"; return; }
        
        spinBtn.disabled = true;
        const extraSpins = 5; // Vueltas mínimas
        const randomDeg = Math.floor(Math.random() * 360); // Aleatorio
        const totalDeg = (extraSpins * 360) + randomDeg;
        
        currentRotation += totalDeg;
        
        if (canvas) {
            // Animación suave CSS
            canvas.style.transition = "transform 4s cubic-bezier(0.15, 0.80, 0.15, 1.0)"; 
            canvas.style.transform = `rotate(-${currentRotation}deg)`;
        }
        
        const msgArea = document.getElementById("msg-area");
        if(msgArea) msgArea.innerText = "Girando...";

        setTimeout(() => {
            // Llamar a la función calibrada
            calculateResult(currentRotation);
            spinBtn.disabled = false;
        }, 4000); // Esperar 4 segundos (duración de la animación)
    });
}

// --- INICIALIZAR ---
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("balance").innerText = currentBalance;
    if (canvas) drawWheel();
    generateBoardLayout();
    
    const undoButton = document.querySelector(".btn-clear");
    if (undoButton) undoButton.addEventListener("click", clearBets);
    
    document.querySelectorAll(".chip-btn").forEach(btn => {
        let text = btn.textContent.replace('K', '000');
        let value = parseInt(text);
        if (!isNaN(value)) btn.addEventListener("click", () => selectChip(value));
    });
    
    selectChip(100);
    updateNumberStats(-1);
});
