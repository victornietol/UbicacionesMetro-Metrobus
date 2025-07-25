// Leer archivo json con estaciones
async function readJSON(route) {
    return fetch(route).then(response => {
        if (!response.ok) {
            throw new Error("No se realizó la carga.");
        }
        return response.json();
    });
}

// Crear elementos de cada estacion
function createElementStation(stations) {
    stations.forEach(station => {
        const name = station["nombre"];
        const line = station["linea"];
        const classInfo = "card card-body text-center"
        if (line=="01") {
            document.getElementById("linea1").innerHTML += `<p class="${classInfo} linea1">${name}`;
        }
        if (line=="02") {
            document.getElementById("linea2").innerHTML += `<p class="${classInfo} linea2">${name}`;
        }
        if (line=="03") {
            document.getElementById("linea3").innerHTML += `<p class="${classInfo} linea3">${name}`;
        }
        if (line=="04") {
            document.getElementById("linea4").innerHTML += `<p class="${classInfo} linea4">${name}`;
        }
        if (line=="05") {
            document.getElementById("linea5").innerHTML += `<p class="${classInfo} linea5">${name}`;
        }
        if (line=="06") {
            document.getElementById("linea6").innerHTML += `<p class="${classInfo} linea6">${name}`;
        }
        if (line=="07") {
            document.getElementById("linea7").innerHTML += `<p class="${classInfo} linea7">${name}`;
        }
        if (line=="08") {
            document.getElementById("linea8").innerHTML += `<p class="${classInfo} linea8">${name}`;
        }
        if (line=="09") {
            document.getElementById("linea9").innerHTML += `<p class="${classInfo} linea9">${name}`;
        }
        if (line=="12") {
            document.getElementById("linea12").innerHTML += `<p class="${classInfo} linea12">${name}`;
        }
        if (line=="A") {
            document.getElementById("lineaA").innerHTML += `<p class="${classInfo} lineaA">${name}`;
        }
        if (line=="B") {
            document.getElementById("lineaB").innerHTML += `<p class="${classInfo} lineaB">${name}`;
        }
    });
}

async function showStations() {
    const stations = await readJSON("info/estaciones_lineas_metro_cdmx.json");
    createElementStation(stations);
} 

showStations();