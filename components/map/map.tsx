"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import Pin from "./pin";
import { ListPropertyInterface } from '@/lib/types/propely.type';

// Prevent default Leaflet icon lookup
delete L.Icon.Default.prototype._getIconUrl;


// Combine custom icons with Leaflet defaults
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Main Map Component
const Map = ({ items }: { items: ListPropertyInterface[] }) => {

  // first item's coordinates or default [51.505, -0.09] (London)
  const initialPosition: [number, number] = items.length
    ? [Number(items[0].latitude), Number(items[0].longitude)]
    : [51.505, -0.09];

  return (
    <MapContainer
      center={initialPosition}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-full"
    >

      {/* Map Tiles (OpenStreetMap Layer) */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render All Pins */}
      {items.map(item => (
        <Pin key={item.id} item={item} />
      ))}

    </MapContainer>
  );
};

export default Map;