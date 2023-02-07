import { useMap } from "react-leaflet";


export default function MapZoom(){
    const map = useMap();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    return null;
}