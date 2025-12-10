// ---------------------------
// DATOS DE LOS PARTIDOS
// ---------------------------
// probL: Probabilidad Local, probE: Empate, probV: Visitante
const partidosData = {
    laliga: [
        { local: "Barcelona", visitante: "Real Madrid", probL: 50, probE: 30, probV: 20 },
        { local: "Sevilla", visitante: "Atlético", probL: 40, probE: 35, probV: 25 },
        { local: "Valencia", visitante: "Villarreal", probL: 33, probE: 33, probV: 34 }
    ],
    premier: [
        { local: "Liverpool", visitante: "Man. United", probL: 55, probE: 25, probV: 20 },
        { local: "Arsenal", visitante: "Chelsea", probL: 50, probE: 30, probV: 20 },
        { local: "Man. City", visitante: "Tottenham", probL: 60, probE: 20, probV: 20 }
    ],
    nfl: [
        { local: "Chiefs", visitante: "Bills", probL: 60, probE: 0, probV: 40 },
        { local: "Eagles", visitante: "Cowboys", probL: 45, probE: 0, probV: 55 },
        { local: "49ers", visitante: "Ravens", probL: 50, probE: 0, probV: 50 }
    ],
    tenis: [
        { local: "Alcaraz", visitante: "Djokovic", probL: 55, probE: 0, probV: 45 },
        { local: "Sinner", visitante: "Nadal", probL: 70, probE: 0, probV: 30 },
        { local: "Medvedev", visitante: "Zverev", probL: 48, probE: 0, probV: 52 }
    ]
};