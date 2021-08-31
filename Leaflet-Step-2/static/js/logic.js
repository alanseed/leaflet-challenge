var newYorkCoords = [40.73, -74.0059];
var mapZoomLevel = 12;

// Create the createMap function
var myMap = L.map("map-id", {
  center: newYorkCoords,
  zoom: mapZoomLevel,
});

// Create the tile layer that will be the background of our map
// Adding tile layer
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(myMap);

var queryUrl = "https://gbfs.citibikenyc.com/gbfs/en/station_information.json";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data);
});

function createFeatures(data) {
  let numberStations = data.data.stations.length;
  var stationData = [];
  for (let i = 0; i < numberStations; i++) {
    let rec = {
      station_id: data.data.stations[i].station_id,
      name: data.data.stations[i].name,
      capacity: data.data.stations[i].capacity,
      location:{
      lat: data.data.stations[i].lat,
      lon: data.data.stations[i].lon},
    };
    stationData.push(rec);
  }
  console.log(stationData);

}

// Create a baseMaps object to hold the lightmap layer

// Create an overlayMaps object to hold the bikeStations layer

// Create the map object with options

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map

// Create the createMarkers function

// Pull the "stations" property off of response.data

// Initialize an array to hold bike markers

// Loop through the stations array
// For each station, create a marker and bind a popup with the station's name

// Add the marker to the bikeMarkers array

// Create a layer group made from the bike markers array, pass it into the createMap function

// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
