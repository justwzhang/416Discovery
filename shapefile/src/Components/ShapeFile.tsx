
import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import shp from 'shpjs';

// use to converted zip file to geojson file
export default function ShapeFile(props: any) {
    const [geoJSONData, setGeoJSONData] = useState<any>(null)
    const { data, union, removeProp, propName, ...geoJSONProps } = props
    // console.log(geoJSONData)
    useEffect(() => {
        (async () => {
            setGeoJSONData(await shp(props.data));
        })();
    }, [props.data])

    useEffect(()=>{
        if(geoJSONData == null || geoJSONData == undefined) return;
        console.log(union);
        let spliceIndex = -1;
        let tempGeo = geoJSONData;
        for(let i=0; i<geoJSONData.features.length; i++){
            if(geoJSONData.features[i].properties[propName] == removeProp[propName]){
                spliceIndex = i;
            }
            if(geoJSONData.features[i].properties[propName] == union.properties[propName]){
                tempGeo.features[i].geometry = union.geometry
            }
        }
        if(spliceIndex != -1){
            tempGeo.features.splice(spliceIndex, 1);
            setGeoJSONData(tempGeo);
        }
        
    }, [union, removeProp])

    return (
        <GeoJSON key={Math.random()} data={geoJSONData} {...geoJSONProps} />
    )
}
