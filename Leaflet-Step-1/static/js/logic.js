function getColor(d) {
  return d > 100.0 ? "#E31A1C" :
    d > 50.0 ? "#FC4E2A" :
      d > 20.0 ? "#FD8D3C" :
        d > 10.0 ? "#FEB24C" :
          d > 5.0 ? "#FED976" :
            "#FFEDA0";
}

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  id: "light-v10",
  accessToken: API_KEY
});

var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom:10,
  id: "satellite-v9",
  accessToken: API_KEY
});

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
  "Light Map": lightmap,
  "Sat Map": satmap
};

var earthquakes = new L.LayerGroup();

// Create an overlayMaps object to hold the earthquakes layer
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

// set up the legend 
var legend = [{
  name: 'Earthquake Depth',
  layer: earthquakes,
  elements: [
    { label: '0-5 km', html: "<dt style ='background:#FFEDA0;width:25px;height:25px'> </dt>" },
    { label: '5-10 km', html: "<dt style ='background:#FED976;width:25px;height:25px'> </dt>" },
    { label: '10-20 km', html: "<dt style ='background:#FEB24C;width:25px;height:25px'> </dt>" },
    { label: '20-50 km', html: "<dt style ='background:#FD8D3C;width:25px;height:25px'> </dt>" },
    { label: '50-100 km', html: "<dt style ='background:#FC4E2A;width:25px;height:25px'> </dt>" },
    { label: '100 km +', html: "<dt style ='background:#E31A1C;width:25px;height:25px'> </dt>" }
  ]
} ];
var htmlLegend = L.control.htmllegend({ 
  position: "bottomright",
  legends: legend,
  defaultOpacity:0.8,
  collapseSimple:true,
  disableVisibilityControls:true
});
map.addControl(htmlLegend) ;

// set up the markers 
function createMarkers(response) {
  let features = response.features;
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
    marker.addTo(earthquakes);
  }
}

// Perform an API call to the USGS to get earthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
