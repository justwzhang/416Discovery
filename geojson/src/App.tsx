import React, { useMemo, useState } from 'react';
import './App.css';
import { Button, TextField } from '@mui/material';
import { GeoJsonObject, FeatureCollection } from 'geojson';
import { MapContainer, GeoJSON } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import MapZoom from './components/mapZoomComponent';


function App() {
  // const [geoFile, setGeoFile] = useState<File>();
  const [oldGeoJson, setOldGeoJson] = useState<GeoJsonObject|FeatureCollection>();
  const [geoJson, setGeoJson] = useState<GeoJsonObject|FeatureCollection>();
  const [newName, setName] = useState<String>(" ")
  const [index, setIndex] = useState<number>(-1);
  const myStyle = {
    fillColor: 'yellow',
    fillOpacity: 1,
    color:'black',
    weight: 1
  };

  function onEachFeature(feature:any, layer:any){
    const countryName = feature.properties.name;
    layer.bindPopup(countryName);
    layer._events.click.splice(0,1);
    layer.on({
      click: (event:any)=>{
        if(event.originalEvent.ctrlKey == true){
          event.target._openPopup(event);
        }
      },
      dblclick: (event:any)=>{
          console.log(event.target)//event.target = layer
          let currentLayer = event.target;
          let currentName = currentLayer.feature.properties.name;
          for(let i=0; i<(geoJson as any)?.features.length; i++){
            if((geoJson as any)?.features[i].properties.name == currentName){
              setIndex(i);
              setName(currentName);
              // console.log(currentName);
            }
          }
          // currentLayer.bindPopup(newName);
      }
    })
  }

  async function handleFile(selectorFiles:FileList){
    // setGeoFile(selectorFiles[0])
    if(geoJson != undefined){
      setOldGeoJson(geoJson);
    }
    let jsonStringTemp = await selectorFiles[0].text()
    let jsonTemp = JSON.parse(jsonStringTemp)
    // console.log(jsonTemp);
    setGeoJson(jsonTemp);
    test();
  }

  function handleChange(event:any){
    if(event.target.value == ""){
      setName(" ");
    }else{
      setName(event.target.value);
    }
  }

  function handleNameChange(event:any){

    if(event.key == "Enter" && index != -1){
      // console.log(event.key);
      let tempGeoJson = JSON.parse(JSON.stringify(geoJson));//TODO make deep copy
      console.log(index);
      console.log(newName);
      (tempGeoJson as any)!.features[index].properties.name = newName;
      setGeoJson(tempGeoJson);
    }
  }


  function test(){
    // console.log(geoJson);
    // console.log(oldGeoJson);
    // console.log(geoJson == oldGeoJson);
    console.log(index);
    console.log(geoJson)
    if(index != -1)
    console.log((geoJson as any)!.features[index].properties.name)
  }

  const GeoJsonComponent = useMemo(()=>{
    return geoJson?<GeoJSON data={geoJson} style = {myStyle} onEachFeature={onEachFeature}></GeoJSON>:null;
  },[geoJson, newName])

  // const GeoJsonComponent = geoJson?<GeoJSON data={geoJson} style = {myStyle} onEachFeature={onEachFeature}></GeoJSON>:null;

  return (
    <div>
      <Button variant="contained" component="label">
        Upload GeoJson File
        <input hidden accept="file" type="file" onChange={(e)=>handleFile(e.target.files!)}/>
      </Button>
      <Button onClick={test}>
        Test
      </Button>
      <MapContainer style={{ height: "70vh", background: "#AACDFF"}} center={[0, 0]} zoom={0} zoomControl={true}>
        <MapZoom/>
        {GeoJsonComponent}
      </MapContainer>
      <TextField label="Change Region Name" variant="outlined" value={newName} style={{width: "100%"}} onChange={handleChange} onKeyDown={handleNameChange}/>
      <div>
        <h4>How To Use</h4>
         To view names of regions, hold ctrl and click on the region.<br/>
         To change the name type in the textbox first then double click on a region to change its name to the written text. View the name again to see the change.
      </div>

    </div>
  );
}

export default App;
