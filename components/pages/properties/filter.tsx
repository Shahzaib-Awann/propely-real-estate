"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, SlidersHorizontal, Sliders, DollarSign, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertiesQueryParamsInterface } from "@/types/propely.type";
import { buildSearchParams } from "@/lib/utils/general";
import { cn } from "@/lib/utils/general";

export default function Filter({ params }: { params: PropertiesQueryParamsInterface }) {
  const router = useRouter();

  // === Toggle states for crisp mobile layouts ===
  const [isExpanded, setIsExpanded] = useState(false);

  // === Local States ===
  const [query, setQuery] = useState({
    search: params?.search ?? "",
    type: params?.type ?? "any",
    location: params?.location ?? "",
    minPrice: params?.minPrice ?? "0",
    maxPrice: params?.maxPrice ?? "0",
    property: params?.property ?? "any",
    bedroom: params?.bedroom ?? "0",
  });

  const handleChange = useCallback(
    (key: keyof typeof query, value: string) =>
      setQuery((prev) => ({ ...prev, [key]: value })),
    []
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedParams = {
      search: query.search?.trim() !== "" ? query.search.trim() : undefined,
      type: query.type !== "any" ? query.type : undefined,
      location: query.location.trim() || undefined,
      minPrice: query.minPrice && Number(query.minPrice) > 0 ? query.minPrice : undefined,
      maxPrice: query.maxPrice && Number(query.maxPrice) > 0 ? query.maxPrice : undefined,
      property: query.property !== "any" ? query.property : undefined,
      bedroom: query.bedroom && Number(query.bedroom) > 0 ? query.bedroom : undefined,
      limit: params.limit && Number(params.limit) > 0 ? params.limit : "10",
      page: "1",
    };

    const searchParams = buildSearchParams(normalizedParams);
    router.replace(`?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4 bg-background select-none p-1">

      {/* Contextual Header Display */}
      {(params.search || params.location) && (
        <h1 className="text-xl md:text-2xl font-lato font-bold text-foreground tracking-tight">
          {params.search ? "Search results for " : "Showing properties in "}
          <span className="text-primary border-b-2 border-primary/20 pb-0.5">
            {params.search || params.location}
          </span>
        </h1>
      )}

      {/* Main Search & Control Capsule Group */}
      <div className="bg-muted/20 dark:bg-muted/5 border border-border/60 rounded-xl p-3 md:p-4 shadow-2xs transition-all duration-300">

        {/* Core Primary Row (Always Visible) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">

          {/* Main Keyword Input */}
          <div className="md:col-span-6 flex flex-col gap-1.5">
            <label htmlFor="search" className="text-[11px] font-lato font-bold text-muted-foreground tracking-wider uppercase ml-1">
              Search
            </label>
            <div className="relative group">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
              <Input
                id="search"
                type="text"
                variant="simple"
                placeholder="Search neighborhood, property, or keyword..."
                className="w-full h-11 pl-10 pr-4 bg-background border border-border/80 rounded-none focus-within:border-input focus-within:shadow-[0_4px_20px_-4px_rgba(203,100,65,0.04)] text-sm font-medium transition-all"
                value={query.search}
                onChange={(e) => handleChange("search", e.target.value)}
              />
            </div>
          </div>

          {/* City Location Input */}
          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label htmlFor="city" className="text-[11px] font-lato font-bold text-muted-foreground tracking-wider uppercase ml-1">
              Location
            </label>
            <div className="relative group">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
              <Input
                id="city"
                type="text"
                variant="simple"
                placeholder="e.g., Manhattan, New York"
                className="w-full h-11 pl-10 pr-4 bg-background border border-border/80 rounded-none focus-within:border-input focus-within:shadow-[0_4px_20px_-4px_rgba(203,100,65,0.04)] text-sm font-medium transition-all"
                value={query.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </div>

          {/* Responsive Action Core Block */}
          <div className="md:col-span-2 flex gap-2 w-full">
            {/* Mobile / Tablet Filter Expand Trigger */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "lg:hidden flex-1 h-11 border-border/80 bg-background font-lato font-bold text-xs gap-2 rounded-lg text-foreground transition-all duration-200",
                isExpanded && "border-primary bg-primary/5 text-primary"
              )}
            >
              <SlidersHorizontal size={14} />
              Filters
            </Button>

            {/* Core Direct Execution Submission Button */}
            <Button
              type="submit"
              className="flex-1 md:w-full h-11 bg-primary text-primary-foreground hover:bg-primary/95 font-lato font-bold text-sm gap-2 rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Search size={15} strokeWidth={2.5} className="hidden md:inline-block" />
              <span>Search</span>
            </Button>
          </div>
        </div>

        {/* Multi-Parameter Advanced Parameter Panel Layer */}
        <div className={cn(
          "grid-rows-[0fr] opacity-0 pointer-events-none hidden transition-all duration-300 ease-out mt-0",
          "lg:grid lg:grid-rows-[1fr] lg:opacity-100 lg:pointer-events-auto lg:mt-4", // Normal Desktop View
          isExpanded && "grid grid-rows-[1fr] opacity-100 pointer-events-auto mt-4 border-t border-border/40 pt-4" // Toggled Mobile View
        )}>
          <div className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">

            {/* Listing Type Option */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-[11px] font-lato font-bold text-muted-foreground tracking-wider uppercase ml-1">
                Type
              </label>
              <Select value={query.type} onValueChange={(val) => handleChange("type", val)}>
                <SelectTrigger id="type" className="w-full h-10 rounded-none border-border/80 bg-background text-sm font-medium shadow-2xs hover:bg-muted/20 transition-all">
                  <div className="flex items-center gap-2">
                    <Sliders size={13} className="text-muted-foreground/60" />
                    <SelectValue placeholder="Select Type" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border shadow-md">
                  <SelectGroup className="[&_div:focus]:bg-primary [&_div:focus]:text-primary-foreground">
                    {["any", "buy", "rent"].map((opt) => (
                      <SelectItem key={opt} value={opt} className="font-medium font-sans text-xs capitalize cursor-pointer">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Property Structure Option */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="property" className="text-[11px] font-lato font-bold text-muted-foreground tracking-wider uppercase ml-1">
                Property
              </label>
              <Select value={query.property} onValueChange={(val) => handleChange("property", val)}>
                <SelectTrigger id="property" className="w-full h-10 rounded-none border-border/80 bg-background text-sm font-medium shadow-2xs hover:bg-muted/20 transition-all">
                  <div className="flex items-center gap-2">
                    <Home size={13} className="text-muted-foreground/60" />
                    <SelectValue placeholder="Select Category" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border shadow-md">
                  <SelectGroup className="[&_div:focus]:bg-primary [&_div:focus]:text-primary-foreground">
                    {["any", "apartment", "house", "condo", "land"].map((opt) => (
                      <SelectItem key={opt} value={opt} className="font-medium font-sans text-xs capitalize cursor-pointer">
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Investment Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="minPrice" className="text-[11px] font-lato font-bold text-muted-foreground tracking-wider uppercase ml-1">
                Min Price
              </label>
              <div className="relative group">
                <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="minPrice"
                  type="number"
                  variant="simple"
                  placeholder="Min Amount"
                  className="w-full h-10 pl-7 pr-3 bg-background border border-border/80 rounded-none text-xs font-medium transition-all"
                  min={0}
                  step={100}
                  value={query.minPrice === "0" ? "" : query.minPrice}
                  onChange={(e) => handleChange("minPrice", e.target.value || "0")}
                />
              </div>
            </div>

            {/* Maximum Investment Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="maxPrice" className="text-[11px] font-lato font-bold text-muted-foreground tracking-wider uppercase ml-1">
                Max Price
              </label>
              <div className="relative group">
                <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="maxPrice"
                  type="number"
                  variant="simple"
                  placeholder="Max Amount"
                  className="w-full h-10 pl-7 pr-3 bg-background border border-border/80 rounded-none text-xs font-medium transition-all"
                  min={0}
                  step={100}
                  value={query.maxPrice === "0" ? "" : query.maxPrice}
                  onChange={(e) => handleChange("maxPrice", e.target.value || "0")}
                />
              </div>
            </div>

            {/* Bedroom Room Count Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bedroom" className="text-[11px] font-lato font-bold text-muted-foreground tracking-wider uppercase ml-1">
                Bedrooms
              </label>
              <div className="relative group">
                <BedDouble size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  id="bedroom"
                  type="number"
                  variant="simple"
                  placeholder="Count (e.g. 2)"
                  className="w-full h-10 pl-8 pr-3 bg-background border border-border/80 rounded-none text-xs font-medium transition-all"
                  min={0}
                  value={query.bedroom === "0" ? "" : query.bedroom}
                  onChange={(e) => handleChange("bedroom", e.target.value || "0")}
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </form>
  );
}