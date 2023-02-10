import React from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';

export default function TLayer(props: any) {
  const map = useMap();

  map.pm.setGlobalOptions({
    limitMarkersToCount: 20,
  });

  map.pm.addControls({
    position: 'topleft',
    drawCircle: false,
  });

  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
}
