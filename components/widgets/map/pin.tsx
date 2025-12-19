import Image from 'next/image'
import Link from 'next/link'
import { Marker, Popup } from 'react-leaflet'
import { ListPropertyInterface } from '@/lib/types/propely.type';

// Pin: Renders one Marker with Popup
const Pin = ({ item }: { item: ListPropertyInterface }) => {
    return (
        // Marker positioned by item coordinates
        <Marker position={[Number(item.latitude), Number(item.longitude)]}>

            {/* Popup opens on marker click */}
            <Popup>

                <div className='flex gap-5'>
                    {/* Image */}
                    <div className='w-16 h-12 relative overflow-hidden rounded shrink-0'>
                        <Image src={item.img || '/images/default-fallback-image.png'}
                            sizes='64px'
                            alt="image"
                            fill
                            className='object-cover'
                            loading='lazy'
                        />
                    </div>

                    {/* Info container: title (link, truncated), bedrooms, price, */}
                    <div className='flex flex-col justify-between min-w-0'>
                        <Link
                            href={`/properties/${item.id}`}
                            className="truncate overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {item.title}
                        </Link>
                        <span>{item.bedRooms} {item.bedRooms > 1 ? 'Bedrooms' : 'Bedroom'}</span>
                        <b>$ {item.price}</b>
                    </div>
                </div>

            </Popup>
        </Marker>
    )
}

export default Pin