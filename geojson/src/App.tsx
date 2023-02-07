import React, { useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/material';
import L from "leaflet";
import { GeoJsonObject } from 'geojson';
import { Opacity } from '@mui/icons-material';

function App() {
  const [geoFile, setGeoFile] = useState<File>();
  const [geoJson, setGeoJson] = useState<any>(); // GeoJsonObject | GeoJsonObject[]
  // const [map, setMap] = useState<L.Map>();
  

  function onEachFeature(feature:any, layer:any){
    const countryName = feature.properties.name;
    let marker = L.marker([feature.properties.label_x, feature.properties.label_y], {opacity: 0.01});
    marker.bindTooltip(countryName);
    // console.log(map);
    // marker.addTo(layer);
    // console.log(countryName);
    layer.bindPopup(countryName);
  }

  function loadMap(){
    let map = L.map('map').setView([0,0], 0)
    // console.log(geoJson?.features);
    console.log(1)
    var myStyle = {
      fillColor: 'white',
      fillOpacity: 1,
      color:'black',

  };
    L.geoJSON(geoJson, {
      style: myStyle,
      onEachFeature: onEachFeature,
      }).addTo(map)
  }

  async function handelFile(selectorFiles:FileList){
    setGeoFile(selectorFiles[0])
    setGeoJson(JSON.parse(await selectorFiles[0].text()));
    // setMap();
  }

  return (
    <div>
      <Button variant="contained" component="label">
        Upload GeoJson File
        <input hidden accept="file" type="file" onChange={(e)=>handelFile(e.target.files!)}/>
      </Button>
      <Button onClick={()=>loadMap()}>
        View Map
      </Button>
      <div id="map"></div>
    </div>
  );
}

export default App;
