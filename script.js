// Crear el mapa centrado en CDMX
var map = L.map('map').setView([19.4326, -99.1332], 15); // latitud, longitud, zoom

// Cargar mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Agregar un marcador
function addMarker(latitude, longitude, textPopup) {
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(textPopup)
        .openPopup();
}

addMarker(19.4326, -99.1332, "<b>Centro de CDMX</b><br>Aquí está el Zócalo.");

// Agregar un marcador
//var marker = L.marker([19.4326, -99.1332]).addTo(map);
/*
L.marker([19.4326, -99.1332])
    .addTo(map)
    .bindPopup("<b>Centro de CDMX</b><br>Aquí está el Zócalo.")
    .openPopup();
*/
// Agregar un popup
//marker.bindPopup("<b>Centro de CDMX</b><br>Aquí está el Zócalo.").openPopup();
