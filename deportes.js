// ===============================
// SISTEMA DE APUESTAS
// ===============================

let apuestas = JSON.parse(localStorage.getItem("apuestas")) || [];

// Elementos del DOM
const panel = document.getElementById("apuestas-list");
const totalInfo = document.getElementById("total-info");
const totalCount = document.getElementById("total-count");
const totalAmount = document.getElementById("total-amount");
const totalPayout = document.getElementById("total-payout");

// Render inicial desde localStorage
renderApuestas();

// ===============================
// AÑADIR APUESTA
// ===============================
document.querySelectorAll(".bet-btn").forEach(btn => {
    const matchId = btn.dataset.id;

    // Bloquear botón si ya hay apuesta en este partido
    if (apuestas.find(a => a.id === matchId)) {
        btn.disabled = true;
        btn.textContent = "Apuesta hecha";
    }

    btn.addEventListener("click", () => {
        const result = btn.dataset.result;
        const selection = btn.dataset.selection;
        const odds = parseFloat(btn.dataset.odds);

        const existente = apuestas.find(a => a.id === matchId);

        const nuevaApuesta = {
            id: matchId,
            partido: btn.closest(".match-card").dataset.match,
            seleccion: selection,
            resultado: result,
            cuota: odds,
            monto: 10, // monto por defecto editable
            fecha: new Date().toLocaleString()
        };

        if (existente) {
            // Reemplaza la apuesta del mismo partido
            apuestas = apuestas.map(a => a.id === matchId ? nuevaApuesta : a);
        } else {
            apuestas.push(nuevaApuesta);
            btn.disabled = true;
            btn.textContent = "Apuesta hecha";
        }

        guardarApuestas();
        renderApuestas();
    });
});

// ===============================
// GUARDAR EN LOCALSTORAGE
// ===============================
function guardarApuestas() {
    localStorage.setItem("apuestas", JSON.stringify(apuestas));
}

// ===============================
// RENDERIZAR APUESTAS
// ===============================
function renderApuestas() {
    panel.innerHTML = "";

    if (apuestas.length === 0) {
        panel.innerHTML = `<p class="placeholder-msg">Haz clic en 'Apostar a...' para empezar.</p>`;
        totalInfo.classList.add("hidden");
        return;
    }

    totalInfo.classList.remove("hidden");

    apuestas.forEach(ap => {
        const div = document.createElement("div");
        div.className = "apuesta-item";
        div.innerHTML = `
            <div class="apuesta-info">
                <strong>${ap.partido}</strong>
                <p>Selección: <span>${ap.seleccion}</span></p>
                <p>Cuota: <span>${ap.cuota}</span></p>
                <p>Monto: <input type="number" class="monto-input" value="${ap.monto}" data-id="${ap.id}"></p>
                <p class="fecha">${ap.fecha}</p>
            </div>

            <div class="apuesta-actions">
                <button class="btn-editar" data-id="${ap.id}">Editar</button>
                <button class="btn-eliminar" data-id="${ap.id}">Eliminar</button>
            </div>
        `;

        panel.appendChild(div);
    });

    actualizarTotales();
    activarEventosEdicion();
    activarEventosEliminar();
}

// ===============================
// ACTUALIZAR MONTO Y TOTALES
// ===============================
function actualizarTotales() {
    let totalApuestas = apuestas.length;
    let totalMonto = 0;
    let ganancia = 0;

    apuestas.forEach(a => {
        totalMonto += Number(a.monto);
        ganancia += Number(a.monto) * a.cuota;
    });

    totalCount.textContent = totalApuestas;
    totalAmount.textContent = totalMonto.toFixed(2);
    totalPayout.textContent = ganancia.toFixed(2);
}

// ===============================
// ELIMINAR
// ===============================
function activarEventosEliminar() {
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;

            apuestas = apuestas.filter(a => a.id !== id);

            // Rehabilitar botón del partido eliminado
            const matchBtn = document.querySelector(`.bet-btn[data-id="${id}"]`);
            if (matchBtn) {
                matchBtn.disabled = false;
                matchBtn.textContent = "Apostar a...";
            }

            guardarApuestas();
            renderApuestas();
        });
    });
}

// ===============================
// EDITAR (selección y monto)
// ===============================
function activarEventosEdicion() {
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const apuesta = apuestas.find(a => a.id === id);

            if (!apuesta) return;

            const opciones = apuesta.partido.split(" vs ");  
            const local = opciones[0];
            const visitante = opciones[1];

            const nuevaSel = prompt(
                "Edita la selección:\n1 - " + local + "\n2 - Empate\n3 - " + visitante,
                apuesta.seleccion
            );

            if (!nuevaSel) return;

            if (nuevaSel === "1") apuesta.seleccion = local;
            else if (nuevaSel === "2") apuesta.seleccion = "Empate";
            else if (nuevaSel === "3") apuesta.seleccion = visitante;

            apuesta.fecha = new Date().toLocaleString();

            guardarApuestas();
            renderApuestas();
        });
    });

    // Editar el monto
    document.querySelectorAll(".monto-input").forEach(input => {
        input.addEventListener("change", () => {
            const id = input.dataset.id;
            const apuesta = apuestas.find(a => a.id === id);

            apuesta.monto = Number(input.value);
            guardarApuestas();
            actualizarTotales();
        });
    });
}


