import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import React from 'react'

const Filter = () => {
    return (
        <div className='flex flex-col gap-2.5'>
            <h1 className='text-2xl'>Search Result for <b>Pakistan</b></h1>

            {/* Top */}
            <div>
                <div>
                    <label htmlFor="city" className='text-xs'>Location</label>
                    <Input type='text' variant="simple" placeholder='City Location' name='city' id='city' className='rounded-xs ring-0' />
                </div>
            </div>

            {/* Bottom */}
            <div className='flex flex-row flex-wrap gap-2 w-full justify-between'>

                {/* Type */}
                <div>
                    <label htmlFor="type" className='text-xs'>Type</label>
                    <Select defaultValue="any" name='type'>
                        <SelectTrigger id="type" className="w-24 shrink-0 rounded-xs border shadow">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="[&_div:focus]:bg-[#cb6441] [&_div:focus]:text-white">
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="buy">Buy</SelectItem>
                                <SelectItem value="rent">Rent</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Property */}
                <div>
                    <label htmlFor="property" className='text-xs'>Property</label>
                    <Select defaultValue="any" name='property'>
                        <SelectTrigger id="property" className="w-24 shrink-0 rounded-xs border shadow">
                            <SelectValue placeholder="Select a Property" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup className="[&_div:focus]:bg-[#cb6441] [&_div:focus]:text-white">
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="apartment">Apartment</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="condo">Condo</SelectItem>
                                <SelectItem value="land">Land</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Min Price */}
                <div className='flex flex-col shrink-0 justify-end'>
                    <label htmlFor="minPrice" className='text-xs'>Min Price</label>
                    <Input type='number' variant="simple" placeholder='Price' className='w-24 rounded-xs' name='minPrice' id='minPrice' />
                </div>

                {/* Max Price */}
                <div className='flex flex-col shrink-0 justify-end'>
                    <label htmlFor="maxPrice" className='text-xs'>Max Price</label>
                    <Input type='number' variant="simple" placeholder='Price' className='w-24 rounded-xs' name='maxPrice' id='maxPrice' />
                </div>

                {/* Bedrooms */}
                <div className='flex flex-col shrink-0  justify-end'>
                    <label htmlFor="bedroom" className='text-xs'>Bedroom</label>
                    <Input type='number' variant="simple" placeholder='XX' className='w-24 rounded-xs' name='bedroom' id='bedroom' />
                </div>
            </div>

            {/* Search Button */}
            <div className="flex flex-row flex-auto min-w-[120px] justify-end items-end">
    <Button className="flex-auto max-w-full border-none cursor-pointer bg-[#cb6441] h-12 rounded-none">
      <Search className="size-6" />
    </Button>
  </div>

        </div>
    )
}

export default Filter