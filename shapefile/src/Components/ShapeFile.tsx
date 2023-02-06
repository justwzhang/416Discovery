
import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import shp from 'shpjs';

// use to converted zip file to geojson file
export default function ShapeFile(props: any) {
    const [geoJSONData, setGeoJSONData] = useState<any>(null)
    const { data, ...geoJSONProps } = props

    useEffect(() => {
        (async () => {
            setGeoJSONData(await shp(props.data));
        })();
    }, [props.data])

    return (
        <GeoJSON key={Math.random()} data={geoJSONData} {...geoJSONProps} />
    )
}
