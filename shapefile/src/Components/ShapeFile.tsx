import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { GeoJSON, useMap } from 'react-leaflet';
import shp from 'shpjs';
require('../../node_modules/leaflet-draw/dist/leaflet.draw.css');
// use to converted zip file to geojson file
export default function ShapeFile(props: any) {
  const [geoJSONData, setGeoJSONData] = useState<any>(null);
  const [key, setKey] = useState<number>(0);
  const { data, ...geoJSONProps } = props;
  let map = useMap();

  useEffect(() => {
    (async () => {
      setGeoJSONData(await shp(props.data));
      setKey(Math.random());
    })();
  }, [props.data]);

  return (
    <GeoJSON key={key} editable={true} data={geoJSONData} {...geoJSONProps} />
  );
}
