document.addEventListener("DOMContentLoaded", () => {

    const symbols = ["🍒", "🍋", "⭐", "🍉", "🍇", "🔔"];

    function randomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function spin() {
        const balanceElem = document.getElementById("balance");
        let balance = parseInt(balanceElem.textContent, 10);

        // Restar 10€ por cada giro
        balance -= 10;
        balanceElem.textContent = balance;

        const r1 = document.getElementById("reel1");
        const r2 = document.getElementById("reel2");
        const r3 = document.getElementById("reel3");
        const resultText = document.getElementById("result");
        const machine = document.getElementById("machine");
        const lever = document.getElementById("lever");
        const container = document.getElementById("jackpot-container");

        const sSpin = document.getElementById("sound-spin");
        const sStop = document.getElementById("sound-stop");

        // Limpiar resultados previos
        resultText.textContent = "";
        container.innerHTML = "";

        // Sonido de giro
        if (sSpin) {
            sSpin.currentTime = 0;
            sSpin.play();
        }

        // Animaciones
        lever.classList.add("active");
        r1.classList.add("spin-anim");
        r2.classList.add("spin-anim");
        r3.classList.add("spin-anim");
        machine.classList.add("shake");

        let spins = 20;
        let count = 0;

        const finalSymbols = [
            randomSymbol(),
            randomSymbol(),
            randomSymbol()
        ];

        const interval = setInterval(() => {
            r1.textContent = randomSymbol();
            r2.textContent = randomSymbol();
            r3.textContent = randomSymbol();

            count++;
            if (count >= spins) {
                clearInterval(interval);

                r1.textContent = finalSymbols[0];
                r2.textContent = finalSymbols[1];
                r3.textContent = finalSymbols[2];

                r1.classList.remove("spin-anim");
                r2.classList.remove("spin-anim");
                r3.classList.remove("spin-anim");
                machine.classList.remove("shake");
                lever.classList.remove("active");

                if (sStop) {
                    sStop.currentTime = 0;
                    sStop.play();
                }

                if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
                    resultText.textContent = "¡JACKPOT!";
                    showJackpot();
                } else if (finalSymbols[0] === finalSymbols[1] || finalSymbols[1] === finalSymbols[2] || finalSymbols[0] === finalSymbols[2]) {
                    resultText.textContent = "¡Doble!";
                } else {
                    resultText.textContent = "Intenta de nuevo.";
                }
            }
        }, 80);
    }

    function showJackpot() {
        const container = document.getElementById("jackpot-container");
        const machine = document.getElementById("machine");

        machine.classList.add("jackpot-border");

        const overlay = document.createElement("div");
        overlay.className = "jackpot-overlay";

        const text = document.createElement("div");
        text.className = "jackpot-text";
        text.textContent = "JACKPOT";
        overlay.appendChild(text);
        container.appendChild(overlay);

        for (let i = 0; i < 30; i++) {
            const p = document.createElement("div");
            p.className = "jackpot-particle";

            const angle = Math.random() * 2 * Math.PI;
            const distance = 120 + Math.random() * 100;

            p.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
            p.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

            overlay.appendChild(p);
        }

        setTimeout(() => {
            machine.classList.remove("jackpot-border");
            overlay.remove();
        }, 2500);
    }

    // Conectar el botón de girar
    document.querySelector(".btn-spin").addEventListener("click", spin);
});


