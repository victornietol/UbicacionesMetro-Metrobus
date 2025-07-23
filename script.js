// Mostrar u ocultar circulo de carga
function showSpinner(state) {
    if(state) {
        document.getElementById("spinner_loading").innerHTML = `
            <div id="contenedor" class="d-flex justify-content-center align-items-center" style="height: 100px;">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
        `;
        document.getElementById("error_current_ubi").innerText = "Cargando...";
    } else {
        document.getElementById("spinner_loading").innerHTML = "";
        document.getElementById("error_current_ubi").innerText = "";
    }
}

// Leer archivo json con estaciones
async function readJSON(route) {
    return fetch(route).then(response => {
        if (!response.ok) {
            throw new Error("No se realizó la carga.");
        }
        return response.json();
    });
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function error(err) {
    document.getElementById("error_current_ubi").innerText = "Error al obtener la ubicacion, posiblemente el navegador no es compatible.";
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Obtener ubicacion actual
function getCurrentLocation() {
    // Devuelve longitud y latitud
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                const crd = pos.coords;
                const currLon = crd.longitude;
                const currLat = crd.latitude;
                resolve({lon: currLon, lat:currLat});
            },
            error,
            options
        );
    });
}

// Agregar un marcador
function addMarker(latitude, longitude, textPopup, map, markerGroup) {
    const marker = L.marker([latitude, longitude])
                        .addTo(map)
                        .bindPopup(textPopup)
                        .openPopup();
    markerGroup.addLayer(marker);
}

function addCircleMarker(latitude, longitude, textPopup, map, markerGroup) {
    const marker = L.circleMarker([latitude, longitude],{
                            color: 'red',
                            radius: 7,
                            fillColor: '#f03',
                            fillOpacity: 0.5
                        })
                        .addTo(map)
                        .bindPopup(textPopup)
                        .openPopup();
    markerGroup.addLayer(marker);
}

function createMarkersStations(stations, map, markerGroup) { // stations es un array de hashmaps, es decir lo que se cargo el archivo json
    const radio = document.getElementById("option_metro");
    const type = radio.checked ? "Metro" : "Metrobús"
    stations.forEach(station => {
        const name = Object.keys(station)[0];
        const tagName = `<b>${type} ${name}</b>`;
        const lat = station[name][0];
        const lon = station[name][1];
        addMarker(lat, lon, tagName, map, markerGroup);
    });
}


// Variables globales
let map;
let markerGroup;
let stationsMetro;
let stationsMetrobus;

// Crear el mapa centrado en la ubicacion actual
async function initMap() {
    showSpinner(true);
    const currLocation = await getCurrentLocation();
    if (!currLocation) {
        // El error se indica en la funcion error
        return;
    }
    map = L.map('map').setView([currLocation.lat, currLocation.lon], 15); // latitud, longitud, zoom
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    markerGroup = L.layerGroup().addTo(map);

    stationsMetro = await readJSON("info/estaciones_metro_cdmx.json"); // Obtener estaciones del Metro, cargar al iniciar
    createMarkersStations(stationsMetro, map, markerGroup); // Crear markers de las estaciones del Metro
    addCircleMarker(currLocation.lat, currLocation.lon, "<b>Tu ubicación</b>", map, markerGroup); // Crear marker de mi ubicacion actual
    updateViewPositionMap(currLocation.lat, currLocation.lon); // Centrar la vista en la posicion actual
    showSpinner(false);
    getStations();
}

// Verificar que opcion de transporte esta activa para cargar ubicaciones
async function getStations() {
    if(stationsMetro==null) {
        stationsMetro = await readJSON("info/estaciones_metro_cdmx.json");
    }
    if(stationsMetrobus==null) {
        stationsMetrobus = await readJSON("info/estaciones_metrobus_cdmx.json");
    }
}

// Actualizar posicion de la camara o visualizacion del mapa
function updateViewPositionMap(latitude, longitude) {
    map.flyTo([latitude, longitude], 15);
}

// Verificar que opcion de transporte esta activa
function verifyTransportOption() {
    const radioMetro = document.getElementById("option_metro");
    const radioMetrobus = document.getElementById("option_metrobus");
    if(radioMetro.checked) {
        return stationsMetro;
    }
    if(radioMetrobus.checked) {
        return stationsMetrobus;
    }
}

// Actualizar ubicacion actual
async function updateCurrentLocation() {
    showSpinner(true);
    const currLocation = await getCurrentLocation();
    if (!currLocation) {
        // El error se indica en la funcion error
        return;
    }
    getStations(); // Cargar estaciones de metrobus si no se han cargado
    markerGroup.clearLayers(); // Limpiando markers
    createMarkersStations(verifyTransportOption(), map, markerGroup); // Crear markers de las estaciones segun el transporte
    addCircleMarker(currLocation.lat, currLocation.lon, "<b>Tu ubicación</b>", map, markerGroup) // Agregando marker actual
    updateViewPositionMap(currLocation.lat, currLocation.lon);
    showSpinner(false);
}

// Obtiene las coordenadas de la ubicacion indicada en el input
async function getInputLocation(inputLocation) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputLocation)}`;

     try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon };
        } else {
            return { lat: "", lon: "" };
        }
    } catch (error) {
        document.getElementById("error_current_ubi").innerText = "Error al buscar la ubicación";
        return { lat: "Error en la solicitud", lon: "Error en la solicitud" };
    }
}

// Crea los markers para la ubicacion ingresa
async function showInputLocation() {
    showSpinner(true);
    const inputLocation = document.getElementById("inputLocation").value;
    const inputCoords = await getInputLocation(inputLocation);
    markerGroup.clearLayers(); // Limpiando markers
    createMarkersStations(verifyTransportOption(), map, markerGroup); // Crear markers de las estaciones del Metro o Metrobus
    addCircleMarker(inputCoords.lat, inputCoords.lon, "<b>Ubicación aproximada indicada.</b>", map, markerGroup) // Creando marker de posicion indicada
    updateViewPositionMap(inputCoords.lat, inputCoords.lon);
    showSpinner(false);
}



initMap();