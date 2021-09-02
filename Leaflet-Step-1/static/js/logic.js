function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "All earthquakes in past 30 days": earthquakes
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [0, -145],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  var legend =L.control({position:"bottomright"}); 
  legend.onAdd = function(map){  
  var div = L.DomUtil.create("div", "info legend");
  var grades =[1,5,10,20,50,100,200] ;
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += '<i style=”background:' + getColor(grades[i] + 1) + '”></i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    legend.addTo(map);
    return div;
  }
}

function createMarkers(response) {
  // TODO read the bbox to get the bounds for the map 

  let features = response.features;
  let markers = [];
  for (let i = 0; i < features.length; i++) {
    let feature = features[i];
    let linMag = 1000 * Math.pow(10, feature.properties.mag / 2.0);
    let col = getColor(feature.geometry.coordinates[2]);
    let marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      color: col,
      fillColor: col,
      fillOpacity: 0.5,
      radius: linMag
    }
    )
      .bindPopup("<h3>Magnitude: " + feature.properties.mag + "<h3>Depth: " + feature.geometry.coordinates[2] + " km</h3>");
    markers.push(marker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(markers));
}

function getColor(d) {
  return d > 200.0 ? "#7a0177" :
    d > 100.0 ? "#BD0026" :
      d > 50.0 ? "#E31A1C" :
        d > 20.0 ? "#FC4E2A" :
          d > 10.0 ? "#FD8D3C" :
            d > 5.0 ? "#FEB24C’" :
              d > 1.0 ? "#FED976" :
                "#FFEDA0";
}

// Perform an API call to the USGS to get earthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
