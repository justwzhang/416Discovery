import JSZip from 'jszip';
import shp from 'shpjs';
import React, { useState } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import ShapeFile from './Components/ShapeFile';
const { BaseLayer, Overlay } = LayersControl;

function App() {
  const [geoData, setGeoData] = useState<ArrayBuffer | null>(null);

  const style = {
    fillColor: "yellow",
    fillOpacity: 0.9,
    color: "black",
    weight: 1,
  }

  function handleFile(e: any) {
    let reader = new FileReader();
    let files = e.target.files;

    // load shp and dbf file
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

    // load zip file
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function (buffer: any) {
      setGeoData(buffer.target.result);
    }
  }
  function onEachFeature(country: any, layer: any) {
    const countryName = country.properties.name;
    layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random();
  }

  return (
    <div>
      <div >
        <input type="file" onChange={(e) => handleFile(e)} className="inputfile" multiple />
      </div>
      <MapContainer style={{ height: "70vh" }} center={[42.09618442380296, -71.5045166015625]} zoom={5} zoomControl={true}>
        {
          geoData ?
            <ShapeFile data={geoData} style={style} onEachFeature={onEachFeature} /> : null
        }
      </MapContainer>
    </div>
  )
}

export default App;