import { useMemo, useState } from 'react';
import './App.css';
import { Button, TextField } from '@mui/material';
import { GeoJsonObject, FeatureCollection } from 'geojson';
import { MapContainer, GeoJSON, Marker, Polygon } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import MapZoom from './components/mapZoomComponent';
import L from 'leaflet';

function App() {
  // The state variables used
  const [geoJson, setGeoJson] = useState<GeoJsonObject|FeatureCollection>();
  const [newName, setName] = useState<String>(" ");
  const [index, setIndex] = useState<number>(-1);
  const [key, setKey] = useState<number>(0);
  const myStyle = {
    fillColor: 'yellow',
    fillOpacity: 1,
    color:'black',
    weight: 1
  };

  // Called on each layer() to assign a popup name and register both 
  // click and double click events. The click event overrides the 
  // native click event that opens a popup and makes it so ctrl must
  // be pressed to show the popup. Double clicking selects the current
  // layer being edited
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
      dblclick: (event:any)=>{//target = layer
          let currentLayer = event.target;
          let currentName = currentLayer.feature.properties.name;
          for(let i=0; i<(geoJson as any)?.features.length; i++){
            if((geoJson as any)?.features[i].properties.name == currentName){
              setIndex(i);
              setName(currentName);
            }
          }
      },
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: "red",
          fillOpacity: 0.7,
          weight: 2,
          color: "black",
        })
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: 'yellow',
          fillOpacity: 1,
          color:'black',
          weight: 1
        });
      }
    })
  }

  // The handler that parses the input json file
  async function handleFile(selectorFiles:FileList){
    let jsonStringTemp = await selectorFiles[0].text()
    let jsonTemp = JSON.parse(jsonStringTemp)
    setKey(Math.random);
    setGeoJson(jsonTemp);
    setIndex(-1);
    setName("");
  }

  // The handler for name changing from the textbox
  function handleChange(event:any){
    if(event.target.value == ""){
      setName(" ");
    }else{
      setName(event.target.value);
    }
  }

  // The handler for pressing enter on the textbox
  function handleNameChange(event:any){
    if(event.key == "Enter" && index != -1){
      let tempGeoJson = JSON.parse(JSON.stringify(geoJson));
      (tempGeoJson as any)!.features[index].properties.name = newName;
      setGeoJson(tempGeoJson);
      setKey(Math.random);
    }
  }

  // Uses memoized(cashed) geoJson data to create the GeoJSON component 
  const GeoJsonComponent = useMemo(()=>{
    return geoJson?<GeoJSON key={key} data={geoJson} style = {myStyle} onEachFeature={onEachFeature}></GeoJSON>:null;
  },[geoJson])

  // Uses memoized(cashed) geoJson data to create the markers for the names
  const nameMarkers = useMemo(()=>{
    if(geoJson == undefined) return <></>;
    return (<>{
      (geoJson as any)?.features.map((list:any, index:number)=>{
        return(
          <Marker key={index} position = {[list.properties.label_y, list.properties.label_x]} icon={L.divIcon({html:list.properties.name, className:"Name-Marker"})}/>
        );
      })
    }</>);
  }, [geoJson])

  return (
    <div>
      <Button variant="contained" component="label">
        Upload GeoJson File
        <input hidden accept="file" type="file" onChange={(e)=>handleFile(e.target.files!)}/>
      </Button>
      <MapContainer style={{ height: "70vh", background: "#AACDFF"}} center={[0, 0]} zoom={0} zoomControl={true}>
        <MapZoom/>
        {GeoJsonComponent}
        {nameMarkers}
      </MapContainer>
      <TextField label="Change Region Name" variant="outlined" value={newName} style={{width: "100%"}} onChange={handleChange} onKeyDown={handleNameChange}/>
      <div>
         How To Use<br/>
         To view names of regions, hold ctrl and click on the region.<br/>
         To change the name:<br/>
         1. Double click on a region<br/>
         2. Change name in text box<br/>
         3. Hit enter then check name to see the change. Any change after a double click will affect the selected region.
      </div>

    </div>
  );
}

export default App;
