import { useMemo, useState } from 'react';
import './App.css';
import { Button, TextField } from '@mui/material';
import { GeoJsonObject, FeatureCollection } from 'geojson';
import { MapContainer, GeoJSON, Marker, Polygon } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import MapZoom from './components/mapZoomComponent';
import L, { LatLng } from 'leaflet';

function App() {
  // The state variables used
  const [geoJson, setGeoJson] = useState<GeoJsonObject|FeatureCollection>();
  const [newName, setName] = useState<String>(" ");
  const [index, setIndex] = useState<number>(-1);
  const [key, setKey] = useState<number>(0);
  const [enableNames, setEnableNames] = useState<Boolean>(true);
  const [propName, setPropName] = useState<any>(" ");
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
    const countryName = feature.properties[propName];
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
          let currentName = currentLayer.feature.properties[propName];
          for(let i=0; i<(geoJson as any)?.features.length; i++){
            if((geoJson as any)?.features[i].properties[propName] == currentName){
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
    let jsonStringTemp = await (await selectorFiles[0].text()).replace(/\s/g,"");
    let jsonTemp = JSON.parse(jsonStringTemp);
    let jsonTemp2 = {features:jsonTemp.features , type:jsonTemp.type}
    setKey(Math.random);
    setGeoJson(jsonTemp2);
    setIndex(-1);
    setName("");
    setPropName("");
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
      (tempGeoJson as any)!.features[index].properties[propName] = newName;
      setGeoJson(tempGeoJson);
      setKey(Math.random);
    }
  }

  // The handler for enabling and disabling names
  function handleEnableNames(){
    setEnableNames(!enableNames);
    setKey(Math.random);
  }

  // Helps determine the proper name element (has to have one)
  function findPropName(properties:any){
    let tempPropName = properties["name"];
    if(tempPropName != undefined){ 
      setPropName("name"); 
      return;
    }
    tempPropName = properties["NAME"];
    if(tempPropName != undefined){
       setPropName("NAME"); 
       return;
      }
    tempPropName = properties["Name"];
    if(tempPropName != undefined){ 
      setPropName("Name"); 
      return;
    }
    tempPropName = properties["admin"];
    if(tempPropName != undefined){ 
      setPropName("admin"); 
      return;
    }
    tempPropName = properties["ADMIN"];
    if(tempPropName != undefined){ 
      setPropName("ADMIN"); 
      return;
    }
    tempPropName = properties["Admin"];
    if(tempPropName != undefined){ 
      setPropName("Admin"); 
      return;
    }
  }

  function determineBestCoordinateChoice(coordList:any){
    let bestOption = 0;
    for(let i=0; i<coordList.length; i++){
      if(coordList[bestOption][0].length < coordList[i][0].length){
        bestOption = i;
      }
    }
    // console.log(bestOption);
    return bestOption;
  }

  // Uses memoized(cashed) geoJson data to create the GeoJSON component 
  const GeoJsonComponent = useMemo(()=>{
    return geoJson?<GeoJSON key={key} data={geoJson} style = {myStyle} onEachFeature={onEachFeature}></GeoJSON>:null;
  },[geoJson, propName])

  // Uses memoized(cashed) geoJson data to create the markers for the names
  const nameMarkers = useMemo(()=>{
    if(geoJson == undefined || enableNames == false) return <div></div>;
    return (<div>{
      (geoJson as any)?.features.map((list:any, index:number)=>{
        if(propName == "") findPropName(list.properties);
        
        let coords = L.polygon(list.geometry.coordinates[determineBestCoordinateChoice(list.geometry.coordinates)]).getBounds().getCenter();
        let pos = [coords.lng, coords.lat]
        if(list.properties.label_y != undefined){
          pos = [list.properties.label_y, list.properties.label_x]
        }
        return(
          <Marker key={index} position = {[pos[0], pos[1]]} icon={L.divIcon({html:list.properties[propName], className:"Name-Marker"})}/>
        );
      })
    }</div>);
  }, [geoJson, enableNames, propName])

  return (
    <div>
      <Button variant="contained" component="label">
        Upload GeoJson File
        <input hidden accept="file" type="file" onChange={(e)=>handleFile(e.target.files!)}/>
      </Button>
      <Button variant="contained" color={enableNames?"success":"error"} onClick={handleEnableNames}>
        {enableNames?"Disable Names":"Enable Names"}
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
         3. Hit enter with the texbox focused then check name to see the change. Any change after a double click will affect the selected region.
      </div>

    </div>
  );
}

export default App;
