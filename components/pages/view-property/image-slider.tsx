"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils/general";
import { useCallback, useEffect, useState } from "react";

export default function ImageSlider({ images, className }: { images: string[], className?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    updateCurrent();
    api.on("select", updateCurrent);

    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  const handleThumbClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className={cn("w-full mx-auto relative", className)}>

      {/* MAIN IMAGE CAROUSEL */}
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <Card className="bg-transparent border-none shadow-none">
                <CardContent className="relative aspect-video p-0">

                  <Image
                    src={src}
                    alt="image"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="eager"
                    className="object-cover rounded-lg"
                  />

                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute top-1/2 left-5" />
        <CarouselNext className="absolute top-1/2 right-5" />
      </Carousel>

      {/* THUMBNAILS */}
      <div className="mt-0">
        <Carousel>
          <CarouselContent className="flex gap-2 px-7">
            {images.map((src, index) => (
              <CarouselItem
                key={index}
                className="basis-1/5 cursor-pointer p-1"
                onClick={() => handleThumbClick(index)}
              >
                <Card className="overflow-hidden rounded md:rounded-md bg-transparent border-none p-0 transition-all duration-200">
                  <CardContent
                    className={cn(
                      "relative w-full aspect-video p-0",
                      current !== index && "opacity-50"
                    )}
                  >
                    <Image
                      src={src}
                      alt="thumb"
                      fill
                      sizes="100px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
