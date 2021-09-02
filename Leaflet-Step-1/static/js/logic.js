function getColor(d) {
  return d > 200.0 ? "#7a0177" :
    d > 100.0 ? "#BD0026" :
      d > 50.0 ? "#E31A1C" :
        d > 20.0 ? "#FC4E2A" :
          d > 10.0 ? "#FD8D3C" :
            d > 5.0 ? "#FEB24C" :
              d > 1.0 ? "#FED976" :
                "#FFEDA0";
}

var legend = L.control({ position: "bottomright" }) ;

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [1, 5, 10, 20, 50, 100, 200];
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += `<li style="background:` + getColor(grades[i] + 1) + `"></li>` + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  console.log(div);
  return div;
};

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

  legend.addTo(map);
}

function createMarkers(response) {
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
  createMap(L.layerGroup(markers));
}

// Perform an API call to the USGS to get earthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);

function legend_for_depth_layer(layer, name, units, id) {
  // Generate a HTML legend for a Leaflet layer 
  //
  // Arguments:
  // layer: The leaflet Layer object referring to the layer - must be a layer using
  //        choropleth.js
  // name: The name to display in the layer control (will be displayed above the legend, and next
  //       to the checkbox
  // units: A suffix to put after each numerical range in the layer - for example to specify the
  //        units of the values - but could be used for other purposes)
  // id: The id to give the <ul> element that is used to create the legend. Useful to allow the legend
  //     to be shown/hidden programmatically
  //
  // Returns:
  // The HTML ready to be used in the specification of the layers control
  var limits = layer.options.limits;
  var colors = layer.options.colors;
  var labels = [];

  // Start with just the name that you want displayed in the layer selector
  var HTML = name

  // For each limit value, create a string of the form 'X-Y'
  limits.forEach(function (limit, index) {
      if (index === 0) {
          var to = parseFloat(limits[index]).toFixed(0);
          var range_str = "< " + to;
      }
      else {
          var from = parseFloat(limits[index - 1]).toFixed(0);
          var to = parseFloat(limits[index]).toFixed(0);
          var range_str = from + "-" + to;
      }

      // Put together a <li> element with the relevant classes, and the right colour and text
      labels.push('<li class="sublegend-item"><div class="sublegend-color" style="background-color: ' +
          colors[index] + '"> </div> ' + range_str + units + '</li>');
  })

  // Put all the <li> elements together in a <ul> element
  HTML += '<ul id="' + id + '" class="sublegend">' + labels.join('') + '</ul>';

  return HTML;
}