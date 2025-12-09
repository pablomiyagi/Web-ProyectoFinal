// --- CONFIGURACIÓN Y ESTADO INICIAL ---
const balanceElement = document.getElementById("balance");
const lastWinnerElement = document.getElementById("lastWinner");
const betHorseSelect = document.getElementById("betHorse");
const betAmountInput = document.getElementById("betAmount");
const startRaceBtn = document.querySelector(".btn-start-race");
const messageArea = document.getElementById("message");
const resultArea = document.getElementById("result");

const horses = [
    { id: "horse1", name: "Pegaso", baseSpeed: 10, variance: 8, odds: 2.5 },
    { id: "horse2", name: "Ramoncin", baseSpeed: 11, variance: 7, odds: 3.0 },
    { id: "horse3", name: "Bufalo", baseSpeed: 9, variance: 9, odds: 4.0 },
    { id: "horse4", name: "Perdigon", baseSpeed: 10.5, variance: 7.5, odds: 3.5 }
];

let currentBalance = parseInt(balanceElement.innerText);
let raceInterval = null;
const finishLineOffset = 80; // Margen para que el caballo se detenga antes de la meta real
let raceFinished = false;

// --- FUNCIONES DE INTERFAZ DE USUARIO ---

function updateBalance(amount) {
    currentBalance += amount;
    balanceElement.innerText = currentBalance;
}

function showMessage(msg, type = "info") {
    messageArea.innerText = msg;
    if (type === "error") {
        messageArea.style.color = "#ff3344"; // Rojo
    } else if (type === "success") {
        messageArea.style.color = "#00cc66"; // Verde
    } else {
        messageArea.style.color = "#fff"; // Blanco por defecto
    }
}

function disableControls(disabled) {
    startRaceBtn.disabled = disabled;
    betHorseSelect.disabled = disabled;
    betAmountInput.disabled = disabled;
}

// --- LÓGICA DE LA CARRERA ---

function resetRace() {
    raceFinished = false;
    resultArea.innerHTML = "";
    horses.forEach(h => {
        const horseElement = document.getElementById(h.id);
        horseElement.style.transform = `translateX(0px)`;
    });
    showMessage("Hagan sus apuestas...");
    disableControls(false);
}

function placeBetAndStartRace() {
    if (raceInterval) {
        clearInterval(raceInterval);
    }
    resetRace(); // Asegurarse de que la pista está limpia y los caballos al inicio

    const selectedHorseId = betHorseSelect.value;
    const betAmount = parseInt(betAmountInput.value);

    if (isNaN(betAmount) || betAmount <= 0) {
        showMessage("Por favor, introduce una cantidad de apuesta válida.", "error");
        return;
    }
    if (betAmount > currentBalance) {
        showMessage("Saldo insuficiente para esta apuesta.", "error");
        return;
    }

    updateBalance(-betAmount); // Restar la apuesta del saldo
    showMessage(`Apostado ${betAmount}€ en ${horses[selectedHorseId - 1].name}. ¡La carrera comienza!`, "info");
    disableControls(true); // Deshabilitar controles mientras la carrera está en marcha

    startRace(selectedHorseId, betAmount);
}

function startRace(userBetHorseId, userBetAmount) {
    const raceTrackWidth = document.querySelector(".race-track").offsetWidth;
    const finishLine = raceTrackWidth - finishLineOffset;

    let currentPositions = horses.map(() => 0); // Posición de cada caballo
    let winner = null;
    let winnerName = null;
    let winnerOdds = 1; // Cuota del caballo ganador

    resultArea.innerHTML = "<h3>¡En sus marcas, listos, FUERA!</h3>";
    resultArea.style.color = "#fff";

    raceInterval = setInterval(() => {
        if (raceFinished) return;

        horses.forEach((horse, index) => {
            if (currentPositions[index] >= finishLine) return; // Si ya ha cruzado la meta

            // Calcular velocidad con base y varianza aleatoria
            const speed = horse.baseSpeed + (Math.random() * horse.variance - horse.variance / 2);
            currentPositions[index] += speed;

            // Mover caballo con CSS transform para fluidez
            const horseElement = document.getElementById(horse.id);
            horseElement.style.transform = `translateX(${currentPositions[index]}px)`;
            
            // Mover el nombre del caballo junto a él
            const horseNameElement = horseElement.nextElementSibling;
            if (horseNameElement) {
                horseNameElement.style.transform = `translateX(${currentPositions[index]}px)`;
            }

            // Detectar ganador
            if (currentPositions[index] >= finishLine && winner === null) {
                winner = index + 1;
                winnerName = horse.name;
                winnerOdds = horse.odds;
                raceFinished = true; // La carrera ha terminado
            }
        });

        // Al finalizar la carrera
        if (winner !== null && raceFinished) {
            clearInterval(raceInterval);
            lastWinnerElement.innerText = winnerName;

            if (parseInt(userBetHorseId) === winner) {
                const winnings = userBetAmount * winnerOdds;
                updateBalance(winnings);
                resultArea.innerHTML = `🎉 ¡Ganaste! El Caballo ${winnerName} ganó con una cuota de ${winnerOdds}x. Ganas ${winnings.toFixed(2)}€ 🎉`;
                resultArea.style.color = "#00cc66";
                showMessage(`¡Felicidades! Ganaste ${winnings.toFixed(2)}€`, "success");
            } else {
                resultArea.innerHTML = `❌ Perdiste. El ganador fue el Caballo ${winnerName}.`;
                resultArea.style.color = "#ff3344";
                showMessage("Mejor suerte la próxima vez.", "error");
            }
            disableControls(false); // Habilitar controles para la nueva apuesta
        }

    }, 70); // Intervalo de actualización más rápido para mayor fluidez
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    balanceElement.innerText = currentBalance;
    resetRace();
});