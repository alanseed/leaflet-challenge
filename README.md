# leaflet-challenge
Monash Uni Data Analytics Bootcamp assignment  

## Introduction  
This web page shows the magnitude and depth of all earthquakes that have been registered by the [United States Geological Survey (USGS)](https://www.usgs.gov/) in the past 30 days.  

The maps are supplied by [MapBox](https://www.mapbox.com/)  and [OpenStreetMap](https://www.openstreetmap.org/) and the map controls use the [Leaflet](https://leafletjs.com/) JavaScript library.  

The [magnitude](https://www.usgs.gov/natural-hazards/earthquake-hazards/science/earthquake-magnitude-energy-release-and-shaking-intensity?qt-science_center_objects=0#qt-science_center_objects) of an earthquake is recorded as the logarithm of the product of the rigidity of the rock, the area of the fault that slipped and the distance that the fault moved. The energy released by an earthquake increases 32x for each integer of magnitude. The intensity of the shaking due to an earthquake decreased as the depth of the earthquake increases. Shallow earthquakes with a large mangnitude cause significant damage.  Therefore I represented the magnitude of the earthquake with a circle where the radius varies as the power of the magnitude.  

## File structure  
* ```README.md```  
* ```.gitignore```  
* ```Leaflet-Step-1```  
  * ```index.html```  
  * ```static```  
    * ```css```  
      * ```style.css```  
    * ```js```  
      * ```config.js```  
      * ```logic.js```  
   









