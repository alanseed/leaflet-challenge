function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [0, 0],
    zoom: 1,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {
  // TODO read the bbox to get the bounds for the map 
  
  let features = response.features;
  let markers = [];
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    let marker = L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
      // .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");
    markers.push(marker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(markers));
}

// Perform an API call to the USGS to get earthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
