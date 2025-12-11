"use client";

import { listDataInterface } from '@/lib/dummyData';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { MapSkeleton } from '../skeletons';

const MapWrapper = ({ items, className }: { items: listDataInterface[], className?: string }) => {

  // Dynamically import Map with no SSR and custom loading message
  const Map = useMemo(() => dynamic(
    () => import('@/components/map/map'),
    {
      loading: () => <MapSkeleton />, // <- loading text
      ssr: false  // <- Disable server-side rendering
    }
  ), [])

  return  <div className={cn("w-full h-full overflow-hidden", className)}>
            <Map items={items} />
          </div>

}

export default MapWrapper