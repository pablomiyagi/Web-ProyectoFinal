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
let raceFinished = false;
const finishLineOffset = 80;


function updateBalance(amount) {
    currentBalance += amount;
    balanceElement.innerText = currentBalance;
}

function showMessage(msg, type = "info") {
    messageArea.innerText = msg;

    const colors = {
        info: "#fff",
        error: "#ff3344",
        success: "#00cc66"
    };

    messageArea.style.color = colors[type] || "#fff";
}

function disableControls(disabled) {
    startRaceBtn.disabled = disabled;
    betHorseSelect.disabled = disabled;
    betAmountInput.disabled = disabled;
}


function resetRace() {
    raceFinished = false;
    resultArea.innerHTML = "";

    horses.forEach(h => {
        const horseElement = document.getElementById(h.id);
        horseElement.style.transform = `translateX(0px)`;

        const nameElement = horseElement.nextElementSibling;
        if (nameElement) nameElement.style.transform = `translateX(0px)`;
    });

    showMessage("Hagan sus apuestas...");
    disableControls(false);
}

function placeBetAndStartRace() {
    if (raceInterval) clearInterval(raceInterval);

    resetRace();

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

    updateBalance(-betAmount);

    showMessage(
        `Apostado ${betAmount}€ en ${horses[selectedHorseId - 1].name}. ¡La carrera comienza!`
    );

    disableControls(true);

    startRace(selectedHorseId, betAmount);
}

function startRace(userBetHorseId, userBetAmount) {
    const raceTrackWidth = document.querySelector(".race-track").offsetWidth;
    const finishLine = raceTrackWidth - finishLineOffset;

    let currentPositions = horses.map(() => 0);
    let winner = null;

    const randomBoosts = horses.map(() => Math.random() * 5);

    resultArea.innerHTML = "<h3>¡En sus marcas, listos, FUERA!</h3>";
    resultArea.style.color = "#fff";

    raceInterval = setInterval(() => {
        if (raceFinished) return;

        horses.forEach((horse, index) => {
            if (currentPositions[index] >= finishLine) return;

            const speed =
                horse.baseSpeed +
                randomBoosts[index] +
                (Math.random() * horse.variance - horse.variance / 2);

            currentPositions[index] += speed;

            const horseElement = document.getElementById(horse.id);
            horseElement.style.transform = `translateX(${currentPositions[index]}px)`;

            const nameElement = horseElement.nextElementSibling;
            if (nameElement) {
                nameElement.style.transform = `translateX(${currentPositions[index]}px)`;
            }
            if (currentPositions[index] >= finishLine && winner === null) {
                winner = index + 1;
                raceFinished = true;
            }
        });

        if (winner !== null) {
            clearInterval(raceInterval);

            const winnerHorse = horses[winner - 1];
            lastWinnerElement.innerText = winnerHorse.name;

            if (parseInt(userBetHorseId) === winner) {
                const winnings = userBetAmount * winnerHorse.odds;
                updateBalance(winnings);

                resultArea.innerHTML =
                    `🎉 ¡Ganaste! El caballo ${winnerHorse.name} ganó con cuota ${winnerHorse.odds}x. ` +
                    `Ganas ${winnings.toFixed(2)}€ 🎉`;
                resultArea.style.color = "#00cc66";

                showMessage(`¡Felicidades! Ganaste ${winnings.toFixed(2)}€`, "success");

            } else {
                resultArea.innerHTML =
                    `❌ Perdiste. El ganador fue el caballo ${winnerHorse.name}.`;
                resultArea.style.color = "#ff3344";

                showMessage("Mejor suerte la próxima vez.", "error");
            }

            disableControls(false);
        }
    }, 70);
}

document.addEventListener("DOMContentLoaded", () => {
    balanceElement.innerText = currentBalance;
    resetRace();
});
