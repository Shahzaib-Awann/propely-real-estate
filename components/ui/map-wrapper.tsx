"use client";

import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'

const MapWrapper = () => {
    const Map = useMemo(() => dynamic(
        () => import('@/components/ui/map'),
        { 
          loading: () => <p>A map is loading</p>,
          ssr: false
        }
      ), [])
    
      return <div className="w-full h-full">
        <Map />
      </div>
}

export default MapWrapper