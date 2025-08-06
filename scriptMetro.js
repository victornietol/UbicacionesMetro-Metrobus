// Boton para subir al inicio de la pagina
const btnSubir = document.getElementById("btn-subir");
window.addEventListener("scroll", () => {
    btnSubir.style.display = window.scrollY > 300 ? "block" : "none";
});

btnSubir.addEventListener("click", () => {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
});

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
        const classInfo = "card card-body text-center";
        let lineaId = "";

        switch (line) {
            case "01": lineaId="linea1"; break;
            case "02": lineaId="linea2"; break;
            case "03": lineaId="linea3"; break;
            case "04": lineaId="linea4"; break;
            case "05": lineaId="linea5"; break;
            case "06": lineaId="linea6"; break;
            case "07": lineaId="linea7"; break;
            case "08": lineaId="linea8"; break;
            case "09": lineaId="linea9"; break;
            case "12": lineaId="linea12"; break;
            case "A": lineaId="lineaA"; break;
            case "B": lineaId="lineaB"; break;
            default: return;
        }

        const lineBody = document.querySelector(`#${lineaId} .accordion-body`);

        if(lineBody) {
            const p = document.createElement("p");
            p.className = `${classInfo} ${lineaId}`;
            p.textContent = name;
            lineBody.appendChild(p);
        }
    });
}

async function showStations() {
    const stations = await readJSON("info/estaciones_lineas_metro_cdmx.json");
    createElementStation(stations);
} 

showStations();