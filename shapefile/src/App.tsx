import JSZip from 'jszip';
import shp from 'shpjs';
import React, { useState, useRef } from 'react';
import { MapContainer, FeatureGroup, TileLayer } from 'react-leaflet';
import mapData from './test_data/countries.json';
import ShapeFile from './Components/ShapeFile';
import L from 'leaflet';
import 'leaflet-editable';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import TLayer from './Components/TLayer';
import { EditControl } from 'react-leaflet-draw';

function App() {
  const [geoData, setGeoData] = useState<ArrayBuffer | null>(null);

  const countryStyle = {
    fillColor: 'yellow',
    fillOpacity: 1,
    color: 'black',
    weight: 1,
  };

  function handleFile(e: any) {
    let reader = new FileReader();
    let files = e.target.files;

    // __________LOAD SHP AND DBF FILE SWITCH
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
    // __________LOAD SHP AND DBF FILE SWITCH

    // __________LOAD ZIP FILE SWITCH
    reader.readAsArrayBuffer(files[0]);
    reader.onload = function (buffer: any) {
      setGeoData(buffer.target.result);
    };
    // __________LOAD ZIP FILE SWITCH
  }
  function onEachCountry(country: any, layer: any) {
    // const countryName = country.properties.NAME_1;
    // layer.bindPopup(countryName);

    layer.options.fillOpacity = Math.random() * 0.4;

    layer.on({
      click: () => {
        console.log(layer.getLatLngs());
      },
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: 'red',
          fillOpacity: 0.7,
          weight: 2,
          color: 'black',
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: Math.random() * 0.4,
          weight: 1,
          color: 'black',
          fillColor: 'yellow',
        });
      },
    });
  }

  return (
    <div>
      <div>
        <input
          type="file"
          onChange={(e) => handleFile(e)}
          className="inputfile"
          multiple
        />
      </div>
      {geoData ? (
        <MapContainer
          style={{ height: '80vh' }}
          center={[42.09618442380296, -71.5045166015625]}
          zoom={7}
          // @ts-ignore
          editable={true}
        >
          {/* <GeoJSON
            style={countryStyle}
            data={(mapData as any).features}
            onEachFeature={onEachCountry}/> */}
          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> */}
          <TLayer />
          {/* <FeatureGroup>
            <EditControl
              position="topright"
              draw={{
                rectangle: false,
              }}
            /> */}
          <ShapeFile
            data={geoData}
            style={countryStyle}
            onEachFeature={onEachCountry}
          />
          {/* </FeatureGroup> */}
        </MapContainer>
      ) : null}
    </div>
  );
}

export default App;
