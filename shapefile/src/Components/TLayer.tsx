import React from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
// import '@geoman-io/leaflet-geoman-free';
import 'leaflet-draw';

export default function TLayer(props: any) {
  const map = useMap();

  // map.pm.addControls({
  //   position: 'topleft',
  //   drawCircle: false,
  // });
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="http://osm.org/copyright%22%3EOpenStreetMap</a> contributors',
  }).addTo(map);
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  // @ts-ignore
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems,
    },
  });
  map.addControl(drawControl);
  return null;
  // return (
  //   <TileLayer
  //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //   />
  // );
}
