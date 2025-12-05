import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listDataInterface } from "@/lib/dummyData";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Bookmark } from "lucide-react";

const ListCard = ({ item }: { item: listDataInterface }) => {
  
  const propertyUrl = `/properties/${item.id}`;

  return (
    <Card className="max-w-full p-4 m-0 flex flex-col sm:flex-row rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      
      {/* Image Section */}
      <CardContent className="relative w-full h-40 sm:w-40 sm:h-44 md:h-44 sm:flex-2 shrink-0 overflow-hidden rounded-lg shadow-md p-0">
        <Link href={propertyUrl} className="relative block w-full h-full">
          {item.img && (
            <Image
              src={item.img}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              className="object-cover"
              loading="lazy"
            />
          )}
        </Link>
      </CardContent>

      {/* Content Section */}
      <div className="flex flex-col flex-3 justify-between gap-4">
        
        <CardHeader className="p-0">
          <div className="flex flex-col gap-4">

            {/* Title */}
            <Link href={propertyUrl}>
              <CardTitle className="text-sm sm:text-lg font-semibold">
                {item.title}
              </CardTitle>
            </Link>

            {/* Address */}
            <Link href={propertyUrl}>
              <CardDescription className="flex items-center gap-1 text-xs sm:text-sm">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>{item.address}</span>
              </CardDescription>
            </Link>

            {/* Price Badge */}
            <Link href={propertyUrl}>
              <div className="inline-flex items-center rounded-sm bg-side-panel px-2.5 py-1 text-sm sm:text-base font-semibold text-primary">
                ${item.price.toLocaleString()}
              </div>
            </Link>

          </div>
        </CardHeader>

        {/* Footer Section */}
        <CardFooter className="flex p-0 items-center justify-between gap-3">

          {/* Bedrooms & Bathrooms */}
          <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs">
            {[
              {
                icon: <BedDouble className="h-3 w-3" />,
                value: item.bedRooms,
                label: "Bedroom",
              },
              {
                icon: <Bath className="h-3 w-3" />,
                value: item.bathRooms,
                label: "Bathroom",
              },
            ].map((i, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1 rounded border bg-muted/50 px-2.5 py-1"
              >
                {i.icon}
                <span className="font-medium">
                  {i.value} {i.label}
                  {i.value > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            aria-label="Save property"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background hover:bg-muted transition-colors"
          >
            <Bookmark className="h-4 w-4" />
          </button>

        </CardFooter>
      </div>
    </Card>
  );
};

export default ListCard;