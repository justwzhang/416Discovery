import React, { useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, TextField } from '@mui/material';
// import L from "leaflet";
import { GeoJsonObject, FeatureCollection } from 'geojson';
import { Opacity } from '@mui/icons-material';
import { MapContainer, GeoJSON, TileLayer, LayersControl } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import MapZoom from './components/mapZoomComponent';


function App() {
  // const [geoFile, setGeoFile] = useState<File>();
  const [geoJson, setGeoJson] = useState<GeoJsonObject|FeatureCollection>();
  const [newName, setName] = useState<String>(" ")
  const myStyle = {
    fillColor: 'yellow',
    fillOpacity: 1,
    color:'black',
    weight: 1
  };

  function onEachFeature(feature:any, layer:any){
    const countryName = feature.properties.name;
    layer.bindPopup(countryName);
    // console.log(layer)
    layer._events.click.splice(0,1);
    // console.log(layer._events.click);
    layer.on({
      click: (event:any)=>{
        if(event.originalEvent.shiftKey == true){
          event.target._openPopup(event);
        }
      },
      dblclick: (event:any)=>{//todo
          console.log(event.target)//event.target = layer
          let currentLayer = event.target;
          let currentName = currentLayer.feature.properties.name;
          let tempGeoJson = {...geoJson};//TODO make deep copy
          // console.log((geoJson as any)?.features);
          for(let i=0; i<(geoJson as any)?.features.length; i++){
            // console.log((geoJson as any)?.features)
            if((geoJson as any)?.features[i].properties.name == currentName){
              // console.log(currentName);
              // (tempGeoJson as any)?.features[i].properties.name = currentName;
            }
          }
          currentLayer.bindPopup(newName);
      }
    })
  }

  async function handelFile(selectorFiles:FileList){
    // setGeoFile(selectorFiles[0])
    let jsonStringTemp = await selectorFiles[0].text()
    let jsonTemp = JSON.parse(jsonStringTemp)
    console.log(jsonTemp);
    setGeoJson(jsonTemp);
  }

  function handleChange(event:any){
    if(event.target.value == ""){
      setName(" ");
    }else{
      setName(event.target.value);
    }
  }

  function test(event:any){
    console.log(geoJson);
  }

  const GeoJsonComponent = useMemo(()=>{
    return geoJson?<GeoJSON data={geoJson} style = {myStyle} onEachFeature={onEachFeature}></GeoJSON>:null;
  },[geoJson, newName])

  return (
    <div>
      <Button variant="contained" component="label">
        Upload GeoJson File
        <input hidden accept="file" type="file" onChange={(e)=>handelFile(e.target.files!)}/>
      </Button>
      <Button onClick={test}>
        Test
      </Button>


      <MapContainer style={{ height: "70vh" }} center={[0, 0]} zoom={0} zoomControl={true}>
        <MapZoom/>
        {
          GeoJsonComponent
        }
      </MapContainer>
      <TextField label="Change Region Name" variant="outlined" style={{width: "100%"}} onChange={handleChange}/>
    </div>
  );
}

export default App;
