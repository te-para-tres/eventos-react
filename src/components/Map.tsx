// import {
//   MapContainer,
//   Marker,
//   TileLayer,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { icon } from "leaflet";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import { useEffect, useState } from "react";

// interface IMapProps {
//   longitud?: number;
//   latitud?: number;
//   height?: number;
//   zoom?: number;
//   onPosicionChange?: (latitud: number, longitud: number) => void;
// }

// const defaultIcon = icon({
//   iconUrl: markerIcon,
//   iconRetinaUrl: markerIcon2x,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// function MapCenterHandler({ center }: { center: [number, number] }) {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center);
//   }, [center, map]);
//   return null;
// }

// function MapClickHandler({
//   setMarkerPosition,
// }: {
//   setMarkerPosition: (latlng: [number, number]) => void;
// }) {
//   useMapEvents({
//     click: (e) => {
//       setMarkerPosition([e.latlng.lat, e.latlng.lng]);
//     },
//   });
//   return null;
// }

// const Map = ({
//   longitud,
//   latitud,
//   height = 300,
//   zoom = 10,
//   onPosicionChange,
// }: IMapProps) => {
//   const [markerPosition, setMarkerPosition] = useState<[number, number]>([
//     latitud ?? 29.0729,
//     longitud ?? -110.9559,
//   ]);

//   const [center, setCenter] = useState<[number, number]>([
//     latitud ?? 29.0729,
//     longitud ?? -110.9559,
//   ]);

//   useEffect(() => {
//     if (latitud && longitud) {
//       setCenter([latitud, longitud]);
//       setMarkerPosition([latitud, longitud]);
//     }
//   }, [latitud, longitud]);

//   const handleMarkerChange = (newPosition: [number, number]) => {
//     setMarkerPosition(newPosition);
//     if (onPosicionChange) {
//       onPosicionChange(newPosition[0], newPosition[1]);
//     }
//   };

//   return (
//     <div style={{ height }}>
//       <MapContainer
//         center={center}
//         zoom={zoom}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={markerPosition} icon={defaultIcon} />
//         <MapClickHandler setMarkerPosition={handleMarkerChange} />
//         <MapCenterHandler center={center} />
//       </MapContainer>
//     </div>
//   );
// };

// export default Map;
