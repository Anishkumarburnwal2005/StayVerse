


var API_TOKEN = mapToken;

var map = new maplibregl.Map({
    container: 'map', // HTML में div ID
    style: `https://api.maptiler.com/maps/streets/style.json?key=${API_TOKEN}`, // MapTiler API URL
    center: listing.geometry.coordinates, // Longitude, Latitude (Example: Delhi)
    zoom: 10 // Zoom Level
});

// Zoom & Rotation Controls ऐड करें
map.addControl(new maplibregl.NavigationControl());

//console.log(coordinates);

const marker = new maplibregl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new maplibregl.Popup({offset:25})
    .setHTML(`<h6>${listing.title}</h6><b><p>${listing.location} (${listing.country})</p></b><B><p>Exact location wll br provided provided after booking!</p></B>`))
    .addTo(map);