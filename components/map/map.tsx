"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import Pin from "./pin";
import { listDataInterface } from "@/lib/dummyData";

// Prevent default Leaflet icon lookup
delete L.Icon.Default.prototype._getIconUrl;


// Combine custom icons with Leaflet defaults
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Main Map Component
const Map = ({ items }: { items: listDataInterface[] }) => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={10}
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