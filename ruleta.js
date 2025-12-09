// --- CONFIGURACIÓN RUEDA AMERICANA ---
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const mainBettingGrid = document.getElementById("mainBettingGrid");

// Variables de Estado
let currentBalance = 10000; // Saldo inicial alto para jugar
let currentChipValue = 100;
let currentRotation = 0;
let bets = {};

// Ruleta Americana (38 Casillas: 0, 00, 1-36)
const numbers = [0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, '00', 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2];

// Helper para obtener el color
function getNumberColor(num) {
    if (num === 0 || num === '00') return "#00cc66";
    const redNums = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const n = parseInt(num);
    return redNums.includes(n) ? "#d32f2f" : "#222";
}

// --- 1. DIBUJAR RUEDA (Canvas) ---
const arcSize = (2 * Math.PI) / numbers.length;

function drawWheel() {
    // ... (Mantener la función drawWheel, que ahora usa el array 'numbers' de 38 elementos)
    // ... (Se adapta automáticamente por arcSize)
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = canvas.width / 2 - 10;

    for (let i = 0; i < numbers.length; i++) {
        const angle = i * arcSize;
        ctx.beginPath();
        ctx.fillStyle = getNumberColor(numbers[i]);
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, angle, angle + arcSize);
        ctx.fill();

        // Texto
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

// --- 2. GENERAR TABLERO DINÁMICO (Layout de la Imagen) ---
function generateBoardLayout() {
    // La imagen tiene la estructura: 1, 4, 7... (Columna 1) / 2, 5, 8... (Columna 2) / 3, 6, 9... (Columna 3)
    const columnNumbers = [];
    for (let i = 1; i <= 36; i++) {
        columnNumbers.push(i);
    }
    
    // Generamos las 12 filas (12 * 3 = 36 números) + la casilla 2:1
    for (let row = 0; row < 12; row++) {
        // Columna 1 (Números: 1, 4, 7, ...)
        const num1 = columnNumbers[row];
        // Columna 2 (Números: 2, 5, 8, ...)
        const num2 = columnNumbers[row + 12];
        // Columna 3 (Números: 3, 6, 9, ...)
        const num3 = columnNumbers[row + 24];

        // Fila de 3 números
        mainBettingGrid.innerHTML += `
            <div class="bet-spot ${getNumberColor(num1) === '#d32f2f' ? 'bg-red' : 'bg-black'}" 
                 id="spot-${num1}" onclick="placeBet(${num1})">${num1}<div class="chip-stack" id="bet-${num1}"></div></div>
            <div class="bet-spot ${getNumberColor(num2) === '#d32f2f' ? 'bg-red' : 'bg-black'}" 
                 id="spot-${num2}" onclick="placeBet(${num2})">${num2}<div class="chip-stack" id="bet-${num2}"></div></div>
            <div class="bet-spot ${getNumberColor(num3) === '#d32f2f' ? 'bg-red' : 'bg-black'}" 
                 id="spot-${num3}" onclick="placeBet(${num3})">${num3}<div class="chip-stack" id="bet-${num3}"></div></div>
            <div class="bet-spot column-bet" id="spot-col${(row % 3) + 1}" onclick="placeBet('col${(row % 3) + 1}')">2-1<div class="chip-stack" id="bet-col${(row % 3) + 1}"></div></div>
        `;
    }
}


// --- 3. LÓGICA DE APUESTAS (Actualizada para Americano y nuevos IDs) ---
function selectChip(value) {
    // ... (Mantener la función selectChip)
    currentChipValue = value;
    document.querySelectorAll(".chip-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = [...document.querySelectorAll(".chip-btn")].find(b => b.textContent == value || b.textContent.includes(value / 1000 + 'K'));
    if(activeBtn) activeBtn.classList.add("active");
}

function placeBet(spot) {
    // ... (Mantener placeBet, usa los nuevos IDs como '1st12', 'even', 'col1', 0, '00', etc.)
    if (currentBalance < currentChipValue) {
        document.getElementById("msg-area").innerText = "¡Saldo insuficiente!";
        return;
    }

    currentBalance -= currentChipValue;
    document.getElementById("balance").innerText = currentBalance;
    document.getElementById("msg-area").innerText = `Apostando ${currentChipValue}€ en ${spot}...`;

    if (!bets[spot]) bets[spot] = 0;
    bets[spot] += currentChipValue;

    const chipEl = document.getElementById(`bet-${spot}`);
    if (chipEl) {
        chipEl.innerText = bets[spot] >= 1000 ? (bets[spot] / 1000 + 'K') : bets[spot];
        chipEl.classList.add("active");
    }
}

function clearBets() {
    // ... (Mantener clearBets)
    let totalBet = 0;
    for (let key in bets) totalBet += bets[key];
    
    currentBalance += totalBet;
    document.getElementById("balance").innerText = currentBalance;
    
    bets = {};
    document.querySelectorAll(".chip-stack").forEach(el => el.classList.remove("active"));
    document.getElementById("msg-area").innerText = "Apuestas borradas";
}

// --- 4. GIRAR Y CALCULAR RESULTADO (Actualizado para Americano) ---
document.getElementById("spinBtn").addEventListener("click", () => {
    // ... (Mantener la función de giro, solo actualiza la variable de tiempo si cambias el CSS)
    if (Object.keys(bets).length === 0) {
        document.getElementById("msg-area").innerText = "¡Pon una ficha primero!";
        return;
    }
    document.getElementById("spinBtn").disabled = true;
    
    const extraSpins = 5;
    const randomDeg = Math.floor(Math.random() * 360);
    const totalDeg = (extraSpins * 360) + randomDeg;
    
    currentRotation += totalDeg;
    canvas.style.transform = `rotate(-${currentRotation}deg)`;

    setTimeout(() => {
        calculateResult(currentRotation % 360);
        document.getElementById("spinBtn").disabled = false;
    }, 4000); // El tiempo debe coincidir con el transition CSS
});

function calculateResult(actualDeg) {
    // Cálculo del índice ganador (38 casillas)
    const sliceAngle = 360 / numbers.length;
    const index = Math.floor(((360 - actualDeg + 270) % 360) / sliceAngle) % numbers.length;
    
    const winningNum = numbers[index];
    const winningColor = getNumberColor(winningNum) === "#d32f2f" ? "red" : (winningNum === 0 || winningNum === '00' ? "green" : "black");
    
    let winnings = 0;

    // --- REVISAR APUESTAS ---
    
    // 1. Pleno (Número exacto) -> Paga 35 a 1
    if (bets[winningNum]) { winnings += bets[winningNum] * 36; }
    if (bets['' + winningNum]) { winnings += bets['' + winningNum] * 36; } // Para '00'

    // 2. Color (Rojo/Negro) -> Paga 1 a 1 (Excluye 0 y 00)
    if (winningNum !== 0 && winningNum !== '00') {
        if (winningColor === "red" && bets["red"]) winnings += bets["red"] * 2;
        if (winningColor === "black" && bets["black"]) winnings += bets["black"] * 2;
    }

    // 3. Par/Impar (Even/Odd) -> Paga 1 a 1 (Excluye 0 y 00)
    if (winningNum !== 0 && winningNum !== '00') {
        const n = parseInt(winningNum);
        const isEven = n % 2 === 0;
        const isOdd = n % 2 !== 0;

        if (isEven && bets["even"]) winnings += bets["even"] * 2;
        if (isOdd && bets["odd"]) winnings += bets["odd"] * 2;
    }
    
    // 4. Docenas (1st 12, 2nd 12, 3rd 12) -> Paga 2 a 1
    const n = parseInt(winningNum);
    if (n >= 1 && n <= 12 && bets["1st12"]) winnings += bets["1st12"] * 3;
    if (n >= 13 && n <= 24 && bets["2nd12"]) winnings += bets["2nd12"] * 3;
    if (n >= 25 && n <= 36 && bets["3rd12"]) winnings += bets["3rd12"] * 3;

    // 5. Columnas (2:1) -> Paga 2 a 1
    if (n > 0 && n % 3 === 1 && bets["col1"]) winnings += bets["col1"] * 3;
    if (n > 0 && n % 3 === 2 && bets["col2"]) winnings += bets["col2"] * 3;
    if (n > 0 && n % 3 === 0 && bets["col3"]) winnings += bets["col3"] * 3;
    
    // 6. Mitades (1-18, 19-36) -> Paga 1 a 1
    if (n >= 1 && n <= 18 && bets["1-18"]) winnings += bets["1-18"] * 2;
    if (n >= 19 && n <= 36 && bets["19-36"]) winnings += bets["19-36"] * 2;


    // --- RESULTADO FINAL ---
    const msgArea = document.getElementById("msg-area");
    if (winnings > 0) {
        currentBalance += winnings;
        document.getElementById("balance").innerText = currentBalance;
        msgArea.innerHTML = `¡GANASTE! Sale el <b>${winningNum}</b><br>Premio: ${winnings}€`;
        msgArea.style.color = "#00cc66";
    } else {
        msgArea.innerHTML = `Sale el <b>${winningNum}</b>. Suerte la próxima.`;
        msgArea.style.color = "#fff";
    }
    
    // Limpiar apuestas
    bets = {};
    document.querySelectorAll(".chip-stack").forEach(el => el.classList.remove("active"));
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    const balanceEl = document.getElementById("balance");
    balanceEl.innerText = currentBalance;
    drawWheel();
    generateBoardLayout();
});