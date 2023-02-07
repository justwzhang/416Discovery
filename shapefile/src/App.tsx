import JSZip from 'jszip';
import shp from 'shpjs';
import React, { useState } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet'
import mapData from './test_data/countries.json'
import ShapeFile from './Components/ShapeFile';
import "leaflet/dist/leaflet.css";

function App() {
  const [geoData, setGeoData] = useState<ArrayBuffer | null>(null);

  const countryStyle = {
    fillColor: "yellow",
    fillOpacity: 1,
    color: "black",
    weight: 1,
  }

  function handleFile(e: any) {
    let reader = new FileReader();
    let files = e.target.files;

    // __________LOAD SHP AND DBF FILE
    // let zip = new JSZip();
    // Array.from(files).forEach((f: any) => {
    //   zip.file(f.name, f);
    // });

    // zip.generateAsync({ type: 'blob' }).then((content) => {
    //   reader.readAsArrayBuffer(content);
    //   reader.onload = function (buffer: any) {
    //     setGeoData(buffer.target.result);
    //   }
    // });
    // __________LOAD SHP AND DBF FILE

    // __________LOAD ZIP FILE SWITCH
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function (buffer: any) {
      setGeoData(buffer.target.result);
    }
    // __________LOAD ZIP FILE SWITCH
  }
  function onEachCountry(country: any, layer: any) {
    const countryName = country.properties.ADMIN;
    console.log(countryName);
    layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random();

    layer.on({
      click: () => {
        console.log('clicked');
      },
    });
  }

  return (
    <div>
      <div >
        <input type="file" onChange={(e) => handleFile(e)} className="inputfile" multiple />
      </div>{
        geoData ?
          <MapContainer style={{ height: "80vh" }} center={[42.09618442380296, -71.5045166015625]} zoom={7}>
            {/* <GeoJSON
            style={countryStyle}
            data={(mapData as any).features}
            onEachFeature={onEachCountry}/> */}
            <ShapeFile data={geoData} style={countryStyle} onEachFeature={onEachCountry} />
          </MapContainer> : null
      }
    </div>
  )
}

export default App;