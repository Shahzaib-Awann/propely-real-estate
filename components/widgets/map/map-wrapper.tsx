"use client";

import { cn } from '@/lib/utils/general';
import dynamic from 'next/dynamic';
import { MapSkeleton } from '../../skeletons';

// Component is declared once on file initialization
const Map = dynamic(
  () => import('@/components/widgets/map/map'),
  {
    loading: () => <MapSkeleton />,
    ssr: false
  }
);

interface MapWrapperProps {
  items: {
    id: string;
    title: string;
    price: string;
    bedRooms: number;
    latitude: string;
    longitude: string;
    img: string;
  }[];
  className?: string;
}

const MapWrapper = ({ items, className }: MapWrapperProps) => {
  return (
    <div className={cn("w-full h-full overflow-hidden", className)}>
      <Map items={items} />
    </div>
  );
};

export default MapWrapper;