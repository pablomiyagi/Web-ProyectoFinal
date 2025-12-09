// --- CONFIGURACIÓN RUEDA AMERICANA ---
const canvas = document.getElementById("wheelCanvas");
// Verificar que el canvas exista antes de intentar obtener el contexto
if (canvas) {
    var ctx = canvas.getContext("2d");
}

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
    if (num === 0 || num === '00') return "#00cc66"; // Verde
    const redNums = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const n = parseInt(num);
    return redNums.includes(n) ? "#d32f2f" : "#222"; // Rojo o Negro
}

// --- 1. DIBUJAR RUEDA (Canvas) ---
function drawWheel() {
    if (!canvas || !ctx) return;
    
    const arcSize = (2 * Math.PI) / numbers.length;
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
    if (!mainBettingGrid) return;

    const columnNumbers = [];
    for (let i = 1; i <= 36; i++) {
        columnNumbers.push(i);
    }
    
    // Generamos las 12 filas (12 * 3 = 36 números) + la casilla 2:1
    let gridHTML = '';
    for (let row = 0; row < 12; row++) {
        const num1 = columnNumbers[row];
        const num2 = columnNumbers[row + 12];
        const num3 = columnNumbers[row + 24];
        
        // Fila de 3 números + Columna 2:1
        gridHTML += `
            <div class="bet-spot ${getNumberColor(num1) === '#d32f2f' ? 'bg-red' : 'bg-black'}" 
                 data-bet="${num1}" id="spot-${num1}" onclick="placeBet('${num1}')">${num1}<div class="chip-stack" id="bet-${num1}"></div></div>
            <div class="bet-spot ${getNumberColor(num2) === '#d32f2f' ? 'bg-red' : 'bg-black'}" 
                 data-bet="${num2}" id="spot-${num2}" onclick="placeBet('${num2}')">${num2}<div class="chip-stack" id="bet-${num2}"></div></div>
            <div class="bet-spot ${getNumberColor(num3) === '#d32f2f' ? 'bg-red' : 'bg-black'}" 
                 data-bet="${num3}" id="spot-${num3}" onclick="placeBet('${num3}')">${num3}<div class="chip-stack" id="bet-${num3}"></div></div>
            <div class="bet-spot column-bet" data-bet="col${row % 3 + 1}" id="spot-col${row % 3 + 1}-${row}" onclick="placeBet('col${row % 3 + 1}')">2-1<div class="chip-stack" id="bet-col${row % 3 + 1}"></div></div>
        `;
    }
    mainBettingGrid.innerHTML = gridHTML;
    
    // Generar apuestas externas (Docenas y Líneas) y Ceros si no están en el HTML
    
    // Ceros (Asumiendo que ya existen en el HTML con las clases .zero-double y .zero-single)
    const zeroDoubleEl = document.querySelector('.zero-double');
    const zeroSingleEl = document.querySelector('.zero-single');

    if (zeroDoubleEl) {
        zeroDoubleEl.setAttribute('data-bet', '00');
        zeroDoubleEl.setAttribute('onclick', "placeBet('00')");
        // Asegurarse de que tengan el ID para el chip-stack
        zeroDoubleEl.innerHTML = '00<div class="chip-stack" id="bet-00"></div>'; 
    }
    if (zeroSingleEl) {
        zeroSingleEl.setAttribute('data-bet', '0');
        zeroSingleEl.setAttribute('onclick', "placeBet('0')");
        zeroSingleEl.innerHTML = '0<div class="chip-stack" id="bet-0"></div>'; 
    }

    // Apuestas de Docenas (Asumiendo que son 1st 12, 2nd 12, 3rd 12)
    const dozenEls = document.querySelectorAll('.dozen-bet'); // Necesitas que estas casillas tengan la clase 'dozen-bet'
    if(dozenEls.length === 3) {
        dozenEls[0].setAttribute('data-bet', '1st12');
        dozenEls[0].setAttribute('onclick', "placeBet('1st12')");
        dozenEls[0].innerHTML = '1st 12<div class="chip-stack" id="bet-1st12"></div>';
        
        dozenEls[1].setAttribute('data-bet', '2nd12');
        dozenEls[1].setAttribute('onclick', "placeBet('2nd12')");
        dozenEls[1].innerHTML = '2nd 12<div class="chip-stack" id="bet-2nd12"></div>';
        
        dozenEls[2].setAttribute('data-bet', '3rd12');
        dozenEls[2].setAttribute('onclick', "placeBet('3rd12')");
        dozenEls[2].innerHTML = '3rd 12<div class="chip-stack" id="bet-3rd12"></div>';
    }

    // Apuestas de Línea (1-18, Par, R, N, Impar, 19-36)
    const lineEls = document.querySelectorAll('.line-bet'); // Necesitas que estas casillas tengan la clase 'line-bet'
    if(lineEls.length === 6) {
        const betIds = ['1-18', 'even', 'red', 'black', 'odd', '19-36'];
        for (let i = 0; i < 6; i++) {
            lineEls[i].setAttribute('data-bet', betIds[i]);
            lineEls[i].setAttribute('onclick', `placeBet('${betIds[i]}')`);
            // El innerHTML debe preservar el texto existente, solo se añade el chip-stack
            const originalText = lineEls[i].innerText;
            lineEls[i].innerHTML = `${originalText}<div class="chip-stack" id="bet-${betIds[i]}"></div>`;
        }
    }

    // Corregir IDs duplicados de columna (col1, col2, col3) en la generación de grid
    document.querySelectorAll('[data-bet^="col"]').forEach((el, index) => {
        const spotId = el.getAttribute('data-bet');
        const chipStack = document.getElementById(`bet-${spotId}`);
        // Solo la última casilla generada por la columna mantendrá el ID original para la apuesta
        if (index < 3) {
            el.setAttribute('id', `spot-${spotId}`);
        } else {
             // El resto de las 2:1 que apuntan a la misma apuesta deben usar el mismo ID de chip
             el.setAttribute('id', `spot-${spotId}-dup${index}`); 
        }
    });
}


// --- 3. LÓGICA DE APUESTAS (Fichas Visuales y UNDO) ---

function selectChip(value) {
    currentChipValue = value;
    document.querySelectorAll(".chip-btn").forEach(btn => btn.classList.remove("active"));
    
    // Encontrar el botón activo usando el valor o la etiqueta 'K'
    const activeBtn = [...document.querySelectorAll(".chip-btn")].find(b => 
        (b.textContent == value) || 
        (value >= 1000 && b.textContent.includes(value / 1000 + 'K'))
    );
    if(activeBtn) activeBtn.classList.add("active");
    
    document.getElementById("msg-area").innerText = `Ficha seleccionada: ${value}€`;
}


function placeBet(spot) {
    const chipValue = currentChipValue;

    if (currentBalance < chipValue) {
        document.getElementById("msg-area").innerText = "¡Saldo insuficiente!";
        return;
    }

    currentBalance -= chipValue;
    // Actualizar el saldo
    const balanceEl = document.getElementById("balance");
    if (balanceEl) balanceEl.innerText = currentBalance;
    
    document.getElementById("msg-area").innerText = `Apostando ${chipValue}€ en ${spot}...`;

    if (!bets[spot]) bets[spot] = 0;
    bets[spot] += chipValue;

    // Usar el ID del chip-stack (ej: bet-1, bet-red, bet-00)
    const chipEl = document.getElementById(`bet-${spot}`);
    
    if (chipEl) {
        // *** MOSTRAR LA FICHA EN LUGAR DEL MONTO TOTAL ***
        
        // 1. Aplicar la clase de estilo de la ficha seleccionada
        // Usamos el valor real para las clases, incluso para 'K'
        const visualValue = chipValue; 
        
        // Limpiar todas las clases visuales de valor y añadir la correcta
        chipEl.className = 'chip-stack'; 
        chipEl.classList.add(`chip-visual-${visualValue}`);
        
        // 2. Mostrar el valor de la ficha seleccionada (no el monto total de la apuesta)
        const chipText = chipValue >= 1000 ? (chipValue / 1000 + 'K') : chipValue;
        chipEl.innerText = chipText;
        
        // 3. Activar la ficha
        chipEl.classList.add("active");
    } else {
        // Para apuestas que comparten el mismo ID de chip (como las columnas 2:1), 
        // simplemente aseguramos que la apuesta se registre y se actualice el saldo.
    }
}

function clearBets() {
    // *** IMPLEMENTACIÓN DEL BOTÓN UNDO (Borrar todo) ***
    
    let totalBet = 0;
    for (let key in bets) totalBet += bets[key];
    
    // Devolver el dinero apostado al saldo
    currentBalance += totalBet;
    const balanceEl = document.getElementById("balance");
    if (balanceEl) balanceEl.innerText = currentBalance;
    
    bets = {}; // Reiniciar el objeto de apuestas
    
    // Borrar TODAS las fichas visuales del tablero
    document.querySelectorAll(".chip-stack").forEach(el => {
        el.classList.remove("active");
        el.className = 'chip-stack'; // Limpiar clases de color
        el.innerText = ''; // Borrar el texto del valor de la ficha
    });
    
    document.getElementById("msg-area").innerText = "Apuestas borradas (UNDO)";
}

// --- 4. GIRAR Y CALCULAR RESULTADO ---
// Asegúrate de que tu botón SPINN tiene id="spinBtn"
const spinBtn = document.getElementById("spinBtn");
if (spinBtn) {
    spinBtn.addEventListener("click", () => {
        if (Object.keys(bets).length === 0) {
            document.getElementById("msg-area").innerText = "¡Pon una ficha primero!";
            return;
        }
        
        spinBtn.disabled = true;
        
        // Lógica de giro
        const extraSpins = 5;
        const randomDeg = Math.floor(Math.random() * 360);
        const totalDeg = (extraSpins * 360) + randomDeg;
        
        currentRotation += totalDeg;
        if (canvas) {
            canvas.style.transform = `rotate(-${currentRotation}deg)`;
        }

        setTimeout(() => {
            calculateResult(currentRotation % 360);
            spinBtn.disabled = false;
        }, 4000); // 4000ms debe coincidir con el transition CSS de la rueda
    });
}

function calculateResult(actualDeg) {
    // Cálculo del índice ganador (38 casillas)
    const sliceAngle = 360 / numbers.length;
    // Ajuste por el puntero de la ruleta (puede variar según el diseño exacto)
    const index = Math.floor(((360 - actualDeg + 270) % 360) / sliceAngle) % numbers.length;
    
    const winningNum = numbers[index];
    const winningColor = getNumberColor(winningNum) === "#d32f2f" ? "red" : (winningNum === 0 || winningNum === '00' ? "green" : "black");
    
    let winnings = 0;
    
    // Función auxiliar para obtener el monto apostado, lidiando con 0/'0'/'00'
    const getBet = (key) => bets[key] || 0;

    // --- REVISAR APUESTAS ---
    
    // 1. Pleno (Número exacto) -> Paga 35 a 1
    winnings += getBet(winningNum) * 36;
    winnings += getBet('' + winningNum) * 36; // Para '00' y '0' como strings

    // 2. Apuestas de grupo (Similares a las que tenías)
    const n = parseInt(winningNum);
    
    // 2a. Color (Rojo/Negro) -> Paga 1 a 1 (Excluye 0 y 00)
    if (winningNum !== 0 && winningNum !== '00') {
        if (winningColor === "red") winnings += getBet("red") * 2;
        if (winningColor === "black") winnings += getBet("black") * 2;
    }

    // 2b. Par/Impar (Even/Odd) -> Paga 1 a 1 (Excluye 0 y 00)
    if (n > 0) {
        const isEven = n % 2 === 0;
        if (isEven) winnings += getBet("even") * 2;
        else winnings += getBet("odd") * 2;
    }
    
    // 2c. Docenas (1st 12, 2nd 12, 3rd 12) -> Paga 2 a 1
    if (n >= 1 && n <= 12) winnings += getBet("1st12") * 3;
    if (n >= 13 && n <= 24) winnings += getBet("2nd12") * 3;
    if (n >= 25 && n <= 36) winnings += getBet("3rd12") * 3;

    // 2d. Columnas (2:1) -> Paga 2 a 1
    if (n > 0 && n % 3 === 1) winnings += getBet("col1") * 3;
    if (n > 0 && n % 3 === 2) winnings += getBet("col2") * 3;
    if (n > 0 && n % 3 === 0) winnings += getBet("col3") * 3;
    
    // 2e. Mitades (1-18, 19-36) -> Paga 1 a 1
    if (n >= 1 && n <= 18) winnings += getBet("1-18") * 2;
    if (n >= 19 && n <= 36) winnings += getBet("19-36") * 2;


    // --- RESULTADO FINAL ---
    const msgArea = document.getElementById("msg-area");
    currentBalance += winnings;
    
    const balanceEl = document.getElementById("balance");
    if (balanceEl) balanceEl.innerText = currentBalance;
    
    if (msgArea) {
        if (winnings > 0) {
            msgArea.innerHTML = `¡GANASTE! Sale el <b>${winningNum}</b><br>Premio: ${winnings}€`;
            msgArea.style.color = "#00cc66";
        } else {
            msgArea.innerHTML = `Sale el <b>${winningNum}</b>. Suerte la próxima.`;
            msgArea.style.color = "#fff";
        }
    }
    
    // Limpiar apuestas para la siguiente ronda
    bets = {};
    document.querySelectorAll(".chip-stack").forEach(el => {
        el.classList.remove("active");
        el.className = 'chip-stack';
        el.innerText = '';
    });
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar el saldo
    const balanceEl = document.getElementById("balance");
    if (balanceEl) balanceEl.innerText = currentBalance;
    
    // Dibujar la rueda
    if (canvas) drawWheel();
    
    // Generar el tablero (números y celdas de apuesta)
    generateBoardLayout();
    
    // Enlazar el botón UNDO
    const undoButton = document.querySelector(".btn-clear");
    if (undoButton) {
        undoButton.addEventListener("click", clearBets);
    }
    
    // Enlazar los botones de ficha para que al hacer clic se seleccione
    document.querySelectorAll(".chip-btn").forEach(btn => {
        // Intentar parsear el valor de la ficha (50, 100, 500, 1000, 2000)
        let value = parseInt(btn.textContent.replace('K', '000'));
        if (!isNaN(value)) {
            btn.addEventListener("click", () => selectChip(value));
        }
    });

    // Asegurar que una ficha esté seleccionada al inicio (ej: 100)
    selectChip(100); 
});