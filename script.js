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

function addCircleMarker(latitude, longitude, textPopup, map) {
    L.circleMarker([latitude, longitude],{
            color: 'red',
            radius: 5,
            fillColor: '#f03',
            fillOpacity: 0.5
        })
        .addTo(map)
        .bindPopup(textPopup)
        .openPopup();
}

// Limpiar y actualizar marcadores
function updateMarkers(newCoords, markerGroup, map) { // newCoords debe ser un array que contiene hashmaps
    markerGroup.clearLayers();
    newCoords.forEach(coord => {
        const marker = L.marker([coord.latitude, coord.longitude])
                            .addTo(map)
                            .bindPopup(coord.textPopup)
                            .openPopup();
        markerGroup.addLayer(marker);
    });
}

// Crear el mapa centrado en la ubicacion actual
let map;
let markerGroup;
async function initMap() {
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
    addMarker(currLocation.lat, currLocation.lon, "<b>Tu ubicación</b>", map, markerGroup);
}

// Actualizar posicion de la camara o visualizacion del mapa
function updateViewPositionMap(latitude, longitude) {
    map.flyTo([latitude, longitude], 15);
}

// Actualizar ubicacion actual
async function updateCurrentLocation() {
    const currLocation = await getCurrentLocation();
    if (!currLocation) {
        // El error se indica en la funcion error
        return;
    }
    const newCoords = [
        {
        latitude: currLocation.lat, 
        longitude: currLocation.lon, 
        textPopup: "<b>Tu ubicación</b>"
        },
    ]
    updateMarkers(newCoords, markerGroup, map); // Actualizar markers
    updateViewPositionMap(currLocation.lat, currLocation.lon);
}



initMap();