"use client";

import { listDataInterface } from '@/lib/dummyData';
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const MapWrapper = ({ items }: { items: listDataInterface[] }) => {

  // Dynamically import Map with no SSR and custom loading message
  const Map = useMemo(() => dynamic(
    () => import('@/components/map/map'),
    {
      loading: () => <p>Map is loading</p>, // <- loading text
      ssr: false  // <- Disable server-side rendering
    }
  ), [])

  return <div className="w-full h-full">
    <Map items={items} />
  </div>
}

export default MapWrapper