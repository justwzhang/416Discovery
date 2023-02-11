import JSZip from 'jszip';
import shp from 'shpjs';
import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet'
import ShapeFile from './Components/ShapeFile';
import "leaflet/dist/leaflet.css";
import { GeoJsonObject, FeatureCollection } from 'geojson';
import * as turf from '@turf/turf';
import { useMap } from "react-leaflet";
import { geoJson } from 'leaflet';
import { Button, TextField } from '@mui/material';

function App() {
  const [geoData, setGeoData] = useState<ArrayBuffer | null>(null);
  const [newName, setName] = useState<String>(" ");
  const [propName, setPropName] = useState<any>(" ");

  const countryStyle = {
    fillColor: "yellow",
    fillOpacity: 1,
    color: "black",
    weight: 1,
  }

  function findPropName(properties: any) {
    let tempPropName = properties["name"];
    if (tempPropName != undefined) {
      setPropName("name");
      return;
    }
    tempPropName = properties["NAME"];
    if (tempPropName != undefined) {
      setPropName("NAME");
      return;
    }
    tempPropName = properties["NAME_1"];
    if (tempPropName != undefined) {
      setPropName("NAME_1");
      return;
    }
    tempPropName = properties["Name"];
    if (tempPropName != undefined) {
      setPropName("Name");
      return;
    }
    tempPropName = properties["admin"];
    if (tempPropName != undefined) {
      setPropName("admin");
      return;
    }
    tempPropName = properties["ADMIN"];
    if (tempPropName != undefined) {
      setPropName("ADMIN");
      return;
    }
    tempPropName = properties["Admin"];
    if (tempPropName != undefined) {
      setPropName("Admin");
      return;
    }
  }

  function handleFile(e: any) {
    let reader = new FileReader();
    let files = e.target.files;

    // __________LOAD SHP AND DBF FILE SWITCH
    let zip = new JSZip();
    Array.from(files).forEach((f: any) => {
      zip.file(f.name, f);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      reader.readAsArrayBuffer(content);
      reader.onload = function (buffer: any) {
        setGeoData(buffer.target.result);
      }
    });
    // __________LOAD SHP AND DBF FILE SWITCH

    // __________LOAD ZIP FILE SWITCH
    // reader.readAsArrayBuffer(files[0]);
    // reader.onload = function (buffer: any) {
    //   setGeoData(buffer.target.result);
    // }
    // __________LOAD ZIP FILE SWITCH
  }

  var selected: any[] = [];
  var indexName: any[] = [];

  function onEachCountry(country: any, layer: any) {
    findPropName(country.properties);
    const countryName = country.properties[propName];
    layer.bindPopup(countryName);
    var mergebt = document.getElementById("mergebt") as HTMLButtonElement;
    var sel = document.getElementById("sel") as any;
    layer.options.fillOpacity = Math.random() * 0.4;

    layer.on({
      click: (e: any) => {
        const layer = e.target;
        var fa = document.getElementById('name') as any;
        const stateName = e.target.feature.properties.NAME_1;
        const stateId = e.target.feature.properties.ID_1;
        fa.innerHTML = stateName + ":" + stateId;

        
        if (selected.length == 0){
          selected.push(layer);
          indexName.push(stateId);
        } else {
          if (indexName[0] == stateId) {
            indexName.shift();
            selected.shift();
          }
          else if (indexName[1] == stateId) {
            indexName.pop();
            selected.pop();
          }
          else if (selected.length == 2) {
            selected.length = 0;
            indexName.length = 0;
            selected.push(layer);
            indexName.push(stateId);
          }
          else {
            selected.push(layer);
            indexName.push(stateId);
          }
        }
        sel.innerHTML = indexName;

        //enable or disable merge button depending on selection
        if (selected.length > 1) {
          mergebt.disabled = false;
        } else {
          mergebt.disabled = true;
        }

      },
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: "red",
          fillOpacity: 0.7,
          weight: 2,
          color: "black",
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
          layer.setStyle({
            fillOpacity: Math.random() * 0.4,
            weight: 1,
            color: 'black',
            fillColor: 'yellow'
        })
      },
    });
  }


  function Merge() {
    for (var i = 0; i < selected.length; ++i){
      if(i == 0) {
        var unions = selected[i].toGeoJSON();
      } else {
        unions = turf.union(unions, selected[i].toGeoJSON());
      }
    }
  }

  function handleChange(e:any) {
    if(e.target.value == ""){
      setName(" ");
    }else{
      setName(e.target.value);
    }
  }

  function handleNameChange(e:any) {
    if (e.key == "Enter"){
      var changedname = e.target.value;
      indexName.length = 0;
      indexName.push(changedname);
      var fa = document.getElementById('name') as any;
      fa.innerHTML = "Changed Name is " + changedname;
      indexName.length = 0;
    }
  }

  return (
    <div>
      <div >
        <input type="file" onChange={(e) => handleFile(e)} className="inputfile" multiple />
      </div>{
        geoData ?
          <MapContainer style={{ height: "80vh" }} center={[42.09618442380296, -71.5045166015625]} zoom={7}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ShapeFile data={geoData} style={countryStyle} onEachFeature={onEachCountry} />
          </MapContainer> : null
      }
      <button id="mergebt" disabled onClick={Merge}>Merge</button>
     <div className ="namebar">
     <table>
     <tr>
       <th>Current</th>
       <td id='name'> </td>
     </tr>
     <tr>
       <th>You choose</th>
       <td id='sel'></td>
     </tr>
     </table>
   </div>
   <TextField label="Change Name" variant="outlined" value={newName} style={{width: "100%"}} onChange={handleChange} onKeyDown={handleNameChange}/>
   </div>
    
  )
}

export default App;