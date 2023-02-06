import JSZip from 'jszip';
import React, { useState } from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import ShapeFile from './Components/ShapeFile';
const { BaseLayer, Overlay } = LayersControl;

function App() {
  const [geoData, setGeoData] = useState<ArrayBuffer | null>(null);

  const style = {
    weight: 2,
    opacity: 1,
    color: "blue",
    dashArray: "3",
    fillOpacity: 0.7
  }

  function handleFile(e: any) {
    let reader = new FileReader();
    let files = e.target.files;

    // load shp and dbf file
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

    // load zip file
    // reader.readAsArrayBuffer(files[0]);
    // reader.onload = function (buffer: any) {
    //   setGeoData(buffer.target.result);
    // }
  }

  function onEachFeature(feature: any, layer: any) {
    if (feature.properties) {
      layer.bindPopup(Object.keys(feature.properties).map(function (k) {
        return k + ": " + feature.properties[k];
      }).join("<br />"), {
        maxHeight: 200
      });
    }
  }

  return (
    <div>
      <div >
        <input type="file" onChange={(e) => handleFile(e)} className="inputfile" multiple />
      </div>
      <MapContainer style={{ height: "80vh" }} center={[42.09618442380296, -71.5045166015625]} zoom={7} zoomControl={true}>
        {
          geoData ?
            <ShapeFile data={geoData} style={style} onEachFeature={onEachFeature} /> : null
        }
      </MapContainer>
    </div>
  )
}

export default App;