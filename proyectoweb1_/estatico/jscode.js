var map = L.map("map").setView([10.982088, -74.783445], 13);
map.addControl(new L.Control.Fullscreen());

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 18, minZoom: 9,
}).addTo(map);

/*
* Definición de iconos, marcadores y polilíneas, además de sus funcionalidades
* 1. Iconos de los taxis en vivo
* 2. Plugin para ubicar un marcador o grupo de marcadores que se encuentren fuera de la vista actual del mapa
* 3. Popups de los marcadores de los taxis
* 4. Marcadores de los taxis
* 5. Inicialización de arrays para las polilíneas
* 6. Inicialización de las polilíneas
*/
var myIcon = L.icon({
	iconUrl: 'https://image.flaticon.com/icons/png/128/2282/2282323.png',
	iconSize: [30, 30],
	iconAnchor: [15, 15],
	popupAnchor: [0, -15],
});

var edgeMarkerLayer = L.edgeMarker({
	icon: L.icon({ // style markers
		iconUrl: 'https://image.flaticon.com/icons/png/128/853/853997.png',
		clickable: true,
		iconSize: [30, 30],
		iconAnchor: [15, 15]
	}),
	rotateIcons: true,
	layerGroup: null
}).addTo(map);

var popup1 = "Taxi 1: AMV569<br>";
var popup2 = "Taxi 2: YLK650<br>";
var marker1 = L.marker([0, 0], { icon: myIcon }).bindPopup(popup1, { autoClose: false }).addTo(map);
var marker2 = L.marker([0, 0], { icon: myIcon }).bindPopup(popup2, { autoClose: false }).addTo(map);
var taxi1 = [];
var taxi2 = [];
var polyline = L.polyline([], { color: 'red', opacity: 0.8, weight: 4, lineJoin: 'round', smoothFactor: 0 }).addTo(map);
var polyline2 = L.polyline([], { color: 'blue', opacity: 0.8, weight: 4, lineJoin: 'round', smoothFactor: 0 }).addTo(map);

/*
* Función que lee los archivos "result.txt" y "result2.txt" cada 1.5 segundos
* Contiene dos jQuery embeidos que toman los datos de los archivos y los añaden a la matriz de datos de la polilínea
* Se añade la información de posición y tiempo medido de cada taxi a su respectivo marcador
*/

function readFile() {
	try {
		jQuery.get('/estatico/result.txt', function (data) {
			var split = data.split("/")
			data1 = split[0];
			data2 = split[1];
			data3 = split[2];
			data4 = split[3];
			console.log(data)
			if (data1 != null && data2 != null && data3 != null) {
				if (data4 == "1") {
					var latlng1 = L.latLng(data1, data2);
					data5 = split[4];
					taxi1.push(latlng1);
					polyline.setLatLngs([taxi1])
					marker1.setLatLng(latlng1).setPopupContent(popup1 + "Longitud: " + data1 + "<br> Latitud: " + data2 + "<br> Tiempo: " + data3 + "<br> Nivel gasolina: " + data5 + "%");
				} else if (data4 == "2") {
					var latlng2 = L.latLng(data1, data2);
					taxi2.push(latlng2);
					polyline2.setLatLngs([taxi2]);
					marker2.setLatLng(latlng2).setPopupContent(popup2 + "Longitud: " + data1 + "<br> Latitud: " + data2 + "<br> Tiempo: " + data3);
				}
			}
		});
	} catch (err) {
		console.log("hubo un error");
	}
} setInterval(readFile, 1500);
