"use client";

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Convert Lucide icon to Leaflet icon
const createCustomIcon = () => {
  const iconHtml = renderToString(
    <MapPin 
      size={32} 
      className='text-white fill-red-500'
    />
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const Map = () => {
  const customIcon = createCustomIcon();

  return (
    <MapContainer 
      center={[51.505, -0.09]} 
      zoom={13} 
      scrollWheelZoom={false} 
      className='w-full h-full rounded-lg'
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]} icon={customIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer> 
  )
}

export default Map