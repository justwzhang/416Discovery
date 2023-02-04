import React, { useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/material';
import L from "leaflet";
import { GeoJsonObject } from 'geojson';

function App() {
  const [geoFile, setGeoFile] = useState<File>();
  const [geoJson, setGeoJson] = useState<GeoJsonObject | GeoJsonObject[]>();

  function loadMap(){
    console.log(geoJson);
    let map = L.map('map').setView([39.74739, -105], 4);
    var myStyle = {
      "fillColor": 'white'
  };
    L.geoJSON(geoJson, {
      style: myStyle
    }).addTo(map)
  }

  async function handelFile(selectorFiles:FileList){
    setGeoFile(selectorFiles[0])
    setGeoJson(JSON.parse(await selectorFiles[0].text()));
    
  }

  return (
    <div>
      <Button variant="contained" component="label">
        Upload GeoJson File
        <input hidden accept="file" type="file" onChange={(e)=>handelFile(e.target.files!)}/>
      </Button>
      <Button onClick={()=>loadMap()}>
        Check
      </Button>
      <div 
        id="map" 
        // style={{backgroundColor:"black"}}
      >

      </div>
    </div>
  );
}

export default App;
