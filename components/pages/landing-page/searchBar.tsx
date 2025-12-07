"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  // === Local States ===
  const [query, setQuery] = useState({ type: "buy", location: "", minPrice: 0, maxPrice: 0 });

  // === Toggle between "buy" and "rent" ===
  const switchType = (value: string) => {
    setQuery((prev) => ({ ...prev, type: value }))
  }

  return (
    <div className="pr-0 lg:pr-12">

      {/* Top Toggle Buttons (Dynamic) */}
      <div className="border w-fit rounded-tl-xs rounded-tr-xs overflow-hidden">
        {["buy", "rent"].map((type) => (
          <Button
            key={type}
            onClick={() => switchType(type)}
            className={cn(
              "px-9 py-6 rounded-none transition-colors",
              query.type === type
                ? "bg-foreground text-background"
                : "bg-transparent text-foreground hover:text-primary-foreground"
            )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Form Section */}
      <form action="" className="sm:border py-1 sm:py-0 -mt-px grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-1 rounded-bl-xs rounded-tl-none overflow-hidden rounded-tr-xs rounded-br-xs">

        {/* Location */}
        <Input
          type="text"
          variant="unstyled"
          name="city"
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="City Location"
          className="px-3 w-full sm:max-w-60 min-w-20 border sm:border-none h-16"
        />

        {/* Min Price */}
        <Input
          type="number"
          variant="unstyled"
          min={0}
          name="min-price"
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
          }
          placeholder="Min Price"
          className="px-3 w-full sm:max-w-60 min-w-20 border sm:border-none h-16"
        />

        {/* Max Price */}
        <Input
          type="number"
          variant="unstyled"
          min={0}
          name="max-price"
          onChange={(e) =>
            setQuery((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          placeholder="Max Price"
          className="px-3 w-full sm:max-w-60 min-w-20 border sm:border-none h-16"
        />

        {/* Search Button */}
        <Button type="submit" size={'icon'} className="max-w-20 w-20 border-none cursor-pointer bg-primary text-primary-foreground flex-1 h-16 rounded-none"><Search className="size-6" /></Button>
      </form>
    </div>
  )
}