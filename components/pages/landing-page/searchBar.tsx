"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState({ type: "buy", location: "", minPrice: 0, maxPrice: 0 });

  const switchType = (value: string) => {
    setQuery((prev) => ({ ...prev, type: value}))
  }

  return (
    <div>
      <div className="border w-fit rounded-tl-xs rounded-none rounded-tr-xs">
        <Button onClick={() => switchType("buy")} className={`${ query.type === 'buy' ? 'bg-[#262626] text-white' : 'bg-transparent text-black' } px-9 py-6 rounded-tl-xs rounded-bl-none rounded-tr-none rounded-br-none hover:text-white `}>Buy</Button>
        <Button onClick={() => switchType("rent")} className={`${ query.type === 'rent' ? 'bg-[#262626] text-white' : 'bg-transparent text-black' } px-9 py-6 rounded-tr-xs rounded-bl-none rounded-tl-none rounded-br-none hover:text-white `}>Rent</Button>
      </div>

        <form action="" className="border h-16 -mt-px flex flex-row justify-between gap-1 rounded-bl-xs rounded-tl-none overflow-hidden rounded-tr-xs rounded-br-xs">
          <input type="text" name="city" placeholder="City Location" className="px-0.5 w-48 outline-none  py-2.5"/>
          <input type="number" min={0} name="min-price" placeholder="Min Price" className="px-9 w-48 outline-none py-6"/>
          <input type="number" min={0} name="max-price" placeholder="Max Price" className="px-9 w-48 outline-none py-6"/>
          <Button type="submit" size={'icon'} className="border-none cursor-pointer bg-[#cb6441] flex-1 h-full rounded-none"><Search className="size-6" /></Button>
        </form>
    </div>
  )
}