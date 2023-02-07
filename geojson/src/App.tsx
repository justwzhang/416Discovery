import React, { useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/material';
// import L from "leaflet";
import { GeoJsonObject } from 'geojson';
import { Opacity } from '@mui/icons-material';
import { MapContainer, GeoJSON, TileLayer, LayersControl } from 'react-leaflet'
import "leaflet/dist/leaflet.css";


function App() {
  const [geoFile, setGeoFile] = useState<File>();
  const [geoJson, setGeoJson] = useState<GeoJsonObject>(); // GeoJsonObject | GeoJsonObject[]
  const myStyle = {
    fillColor: 'yellow',
    fillOpacity: 1,
    color:'black',
    weight: 1
  };
  // const [map, setMap] = useState<L.Map>();
  

  function onEachFeature(feature:any, layer:any){
    console.log(layer)
    const countryName = feature.properties.name;
    layer.bindPopup(countryName);
    // console.log(countryName);
    layer.on({
      click: (event:any)=>{
        console.log("click")
      },
      mouseOver: (event:any)=>{
        event.target.setStyle({
          color: "blue",
          fillColor: "black"
        });
      }
    })
  }

  // function loadMap(){
    // let map = L.map('map').setView([0,0], 0)
    // console.log(geoJson?.features);
    // console.log(1)
    
    // L.geoJSON(geoJson, {
    //   style: myStyle,
    //   onEachFeature: onEachFeature,
    //   }).addTo(map)
  // }

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
      {/* <Button onClick={()=>loadMap()}>
        View Map
      </Button> */}
      <MapContainer style={{ height: "70vh" }} center={[0, 0]} zoom={0} zoomControl={true}>
        {
          geoJson?<GeoJSON data={geoJson} style = {myStyle} onEachFeature={onEachFeature}></GeoJSON>:null
        }
      </MapContainer>
    </div>
  );
}

export default App;
