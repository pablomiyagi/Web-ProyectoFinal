import { useState, useEffect } from "react";

const partidos = [
{
    id: 1,
    local: "Barcelona",
    visitante: "Real Madrid",
    probs: { local: 50, empate: 30, visitante: 20 }
},
{
    id: 2,
    local: "Sevilla",
    visitante: "Atlético",
    probs: { local: 40, empate: 35, visitante: 25 }
},
{
    id: 3,
    local: "Valencia",
    visitante: "Villarreal",
    probs: { local: 33, empate: 33, visitante: 34 }
}
];

export default function PartidosSemana() {
const [bets, setBets] = useState([]);
  const [editing, setEditing] = useState(null); // id de apuesta que se está editando
const [editPick, setEditPick] = useState("");

  // Carga inicial
useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bets")) || [];
    setBets(saved);
}, []);

const saveToStorage = (list) => {
    setBets(list);
    localStorage.setItem("bets", JSON.stringify(list));
};

  // Limita a una apuesta por partido
const addBet = (match, pick) => {
    const exists = bets.find((b) => b.id === match.id);

    const newBet = {
    id: match.id,
    partido: `${match.local} vs ${match.visitante}`,
    apuesta: pick,
    fecha: new Date().toLocaleString()
    };

    let updated;

    if (exists) {
      // Sustituir apuesta existente
    updated = bets.map((b) => (b.id === match.id ? newBet : b));
    } else {
    updated = [...bets, newBet];
    }

    saveToStorage(updated);
};

const deleteBet = (id) => {
    const updated = bets.filter((b) => b.id !== id);
    saveToStorage(updated);
};

const startEdit = (bet) => {
    setEditing(bet.id);
    setEditPick(bet.apuesta);
};

const saveEdit = (id) => {
    const updated = bets.map((b) =>
    b.id === id ? { ...b, apuesta: editPick, fecha: new Date().toLocaleString() } : b
    );

    saveToStorage(updated);
    setEditing(null);
};

return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Partidos */}
    <div style={{ width: "70%" }}>
        <h2>Partidos de la Semana</h2>

        {partidos.map((m) => (
        <div
            key={m.id}
            style={{
            background: "#1E1E2E",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px"
            }}
        >
            <h3>{m.local} vs {m.visitante}</h3>

            {/* Barra de probabilidades */}
            <div style={{ display: "flex", height: "20px", margin: "12px 0" }}>
            <div style={{
                width: `${m.probs.local}%`,
                background: "#2ECC71",
                borderRadius: "8px 0 0 8px"
            }} />
            <div style={{
                width: `${m.probs.empate}%`,
                background: "#F1C40F"
            }} />
            <div style={{
                width: `${m.probs.visitante}%`,
                background: "#E74C3C",
                borderRadius: "0 8px 8px 0"
            }} />
            </div>

            {/* Botones */}
            <div style={{ display: "flex", gap: "10px" }}>
            <button className="betBtn" onClick={() => addBet(m, m.local)}>
                Apostar a {m.local}
            </button>

            <button className="betBtn" onClick={() => addBet(m, "Empate")}>
                Apostar a Empate
            </button>

            <button className="betBtn" onClick={() => addBet(m, m.visitante)}>
                Apostar a {m.visitante}
            </button>
            </div>
        </div>
        ))}
    </div>

      {/* Panel de apuestas */}
    <div
        style={{
        width: "30%",
        background: "#111827",
        padding: "20px",
        borderRadius: "12px",
        border: "2px solid #2ECC71"
        }}
    >
        <h3 style={{ textAlign: "center" }}>Talón de Apuestas</h3>

        {bets.length === 0 && (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
            Haz clic en “Apostar a...” para empezar.
        </p>
        )}

        {bets.map((b) => (
        <div
            key={b.id}
            style={{
            background: "#1F2937",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "12px"
            }}
        >
            <strong>{b.partido}</strong>

            {editing === b.id ? (
            <>
                <select
                value={editPick}
                onChange={(e) => setEditPick(e.target.value)}
                style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "8px",
                    borderRadius: "6px"
                }}
                >
                <option value={b.partido.split(" vs ")[0]}>
                    {b.partido.split(" vs ")[0]}
                </option>
                <option value="Empate">Empate</option>
                <option value={b.partido.split(" vs ")[1]}>
                    {b.partido.split(" vs ")[1]}
                </option>
                </select>

                <button
                className="betBtn"
                style={{ marginTop: "8px", width: "100%" }}
                onClick={() => saveEdit(b.id)}
                >
                Guardar
                </button>
            </>
            ) : (
            <>
                <p>Apuesta: {b.apuesta}</p>
                <small style={{ opacity: 0.6 }}>{b.fecha}</small>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                    className="betBtn"
                    style={{ background: "#F1C40F", color: "#000" }}
                    onClick={() => startEdit(b)}
                >
                    Editar
                </button>

                <button
                    className="betBtn"
                    style={{ background: "#E74C3C" }}
                    onClick={() => deleteBet(b.id)}
                >
                    Eliminar
                </button>
                </div>
            </>
            )}
        </div>
        ))}
    </div>
    </div>
);
}

