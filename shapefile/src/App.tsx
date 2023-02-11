import JSZip from 'jszip';
import shp from 'shpjs';

import React, { useRef } from 'react';
import useState from 'react-usestateref';
import { MapContainer, FeatureGroup, TileLayer } from 'react-leaflet';
import ShapeFile from './Components/ShapeFile';
import L from 'leaflet';
import 'leaflet-editable';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import TLayer from './Components/TLayer';

function App() {
  const [geoData, setGeoData] = useState<ArrayBuffer | null>(null);
  const [propName, setPropName, propNameRef] = useState<any>(" ");

  const countryStyle = {
    fillColor: 'yellow',
    color: 'black',
    weight: 1,
  };

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

  function onEachCountry(country: any, layer: any) {
    layer.options.fillOpacity = Math.random() * 0.4;

    findPropName(country.properties);
    console.log(propNameRef.current);
    const countryName = country.properties[propNameRef.current];
    layer.bindPopup(countryName);

    var selected: any[] = [];
    var mergebt = document.getElementById("mergebt") as HTMLButtonElement;

    layer.on({

      click: (e: any) => {
        const layer = e.target;
        var map = layer;

        //color selected subregion
        if (selected.length > 0) {
          map.closePopup();
          selected.pop();
          layer.setStyle({
            fillOpacity: Math.random() * 0.4,
            weight: 1,
            color: 'black',
            fillColor: 'yellow'
          });
          console.log(selected);
        } else {
          selected.push(map);
          layer.setStyle({
            fillColor: "red",
            fillOpacity: 0.7,
            weight: 2,
            color: "black",
          });
          console.log(selected);
          map = {};
        }

        //enable or disable merge button depending on selection
        if (selected.length > 0) {
          mergebt.disabled = false;
        } else {
          mergebt.disabled = true;
        }

      },
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: 'red',
          fillOpacity: 0.7,
          weight: 2,
          color: "black",
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        if (selected.length > 0) { }
        else {
          layer.setStyle({
            fillOpacity: Math.random() * 0.4,
            weight: 1,
            color: 'black',
            fillColor: 'yellow'
          });
        }
      },
    });
  }


  function Merge() {

  }

  return (
    <div>
      <div >
        <input type="file" onChange={(e) => handleFile(e)} className="inputfile" multiple />
      </div>{
        geoData ?
          <MapContainer style={{ height: "80vh" }} center={[42.09618442380296, -71.5045166015625]} zoom={7} editable={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TLayer />
            <ShapeFile data={geoData} style={countryStyle} onEachFeature={onEachCountry} />
          </MapContainer> : null
      }
      <button id="mergebt" disabled onClick={Merge}>Merge</button>
    </div>
  );
}

export default App;
