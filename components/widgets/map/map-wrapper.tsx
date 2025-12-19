"use client";

import { cn } from '@/lib/utils/general';
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { MapSkeleton } from '../../skeletons';
import { ListPropertyInterface } from '@/lib/types/propely.type';

const MapWrapper = ({ items, className }: { items: ListPropertyInterface[] , className?: string }) => {

  // Dynamically import Map with no SSR and custom loading message
  const Map = useMemo(() => dynamic(
    () => import('@/components/widgets/map/map'),
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