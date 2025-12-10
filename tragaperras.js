const symbols = ["🍒", "🍋", "⭐", "🍉", "🍇", "🔔"];

function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spin() {
    const r1 = document.getElementById("reel1");
    const r2 = document.getElementById("reel2");
    const r3 = document.getElementById("reel3");
    const resultText = document.getElementById("result");
    const machine = document.getElementById("machine");
    const lever = document.getElementById("lever");

    const sSpin = document.getElementById("sound-spin");
    const sStop = document.getElementById("sound-stop");

    resultText.textContent = "";

    // Sonidos
    sSpin.currentTime = 0;
    sSpin.play();

    // Animaciones
    lever.classList.add("active");
    r1.classList.add("spin-anim");
    r2.classList.add("spin-anim");
    r3.classList.add("spin-anim");
    machine.classList.add("shake");

    let spins = 20;
    let count = 0;

    const interval = setInterval(() => {

        r1.textContent = randomSymbol();
        r2.textContent = randomSymbol();
        r3.textContent = randomSymbol();

        count++;

        if (count >= spins) {
            clearInterval(interval);

            // Resultado final
            const final1 = randomSymbol();
            const final2 = randomSymbol();
            const final3 = randomSymbol();

            r1.textContent = final1;
            r2.textContent = final2;
            r3.textContent = final3;

            // Parar animaciones
            r1.classList.remove("spin-anim");
            r2.classList.remove("spin-anim");
            r3.classList.remove("spin-anim");
            machine.classList.remove("shake");
            lever.classList.remove("active");

            // Sonido de final
            sStop.currentTime = 0;
            sStop.play();

            // Resultado
            if (final1 === final2 && final2 === final3) {
                resultText.textContent = "¡JACKPOT!";
                showJackpot();
            } else if (final1 === final2 || final2 === final3 || final1 === final3) {
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

    // Borde parpadeante
    machine.classList.add("jackpot-border");

    // Overlay
    const overlay = document.createElement("div");
    overlay.className = "jackpot-overlay";

    // Texto
    const text = document.createElement("div");
    text.className = "jackpot-text";
    text.textContent = "JACKPOT";

    overlay.appendChild(text);
    container.appendChild(overlay);

    // Crear partículas
    for (let i = 0; i < 30; i++) {
        const p = document.createElement("div");
        p.className = "jackpot-particle";

        // Movimiento aleatorio
        const angle = Math.random() * 360;
        const distance = 120 + Math.random() * 100;

        p.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
        p.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

        overlay.appendChild(p);
    }

    // Desaparece después de 2.5 s
    setTimeout(() => {
        machine.classList.remove("jackpot-border");
        overlay.remove();
    }, 2500);
}
