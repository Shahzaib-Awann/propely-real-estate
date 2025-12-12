"use client";

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
import { PropertiesQueryParamsInterface } from "@/lib/types/propely.type";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

const Filter = ({ params }: {
  params: PropertiesQueryParamsInterface;
}) => {

  // === Local States ===
  const router = useRouter()
  const [query, setQuery] = useState({
    type: params?.type ?? "any",
    location: params?.location ?? "",
    minPrice: params?.minPrice ?? "0",
    maxPrice: params?.maxPrice ?? "0",
    property: params?.property ?? "any",
    bedroom: params?.bedroom ?? "0",
  });

  // === Generic handler for input fields ===
  const handleChange = useCallback(
    (key: keyof typeof query, value: string) =>
      setQuery((prev) => ({ ...prev, [key]: value })),
    []
  );

  // === Build search params & update URL without page reload ===
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const search = new URLSearchParams();

    // Build URL only with non-empty values
    if (query.type !== "any") search.set("type", query.type);
    if (query.location.trim()) search.set("location", query.location);
    if (query.minPrice && Number(query.minPrice) > 0) search.set("minPrice", query.minPrice);
    if (query.maxPrice && Number(query.maxPrice) > 0) search.set("maxPrice", query.maxPrice);
    if (query.property !== "any") search.set("property", query.property);
    if (query.bedroom && Number(query.bedroom) > 0) search.set("bedroom", query.bedroom);

    // Update URL
    router.replace(`?${search.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2.5 w-full">

      {/* Heading */}
      <h1 className="text-2xl">
        Search Result for <b>Pakistan</b>
      </h1>

      {/* Location Input */}
      <div className="flex flex-col">
        <label htmlFor="city" className="text-xs">Location</label>
        <Input
          id="city"
          type="text"
          variant="simple"
          placeholder="City Location"
          className="rounded-xs ring-0"
          value={query.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-2 w-full justify-between">

        {/* Type Selector */}
        <div className="flex flex-col">
          <label htmlFor="type" className="text-xs">
            Type
          </label>
          <Select
            value={query.type}
            onValueChange={(val) => handleChange("type", val)}
            defaultValue="any">
            <SelectTrigger id="type" className="w-24 shrink-0 rounded-xs border shadow">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="[&_div:focus]:bg-primary [&_div:focus]:text-primary-foreground">
                {["any", "buy", "rent"].map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Property Selector */}
        <div className="flex flex-col">
          <label htmlFor="property" className="text-xs">
            Property
          </label>
          <Select
            value={query.property}
            onValueChange={(val) => handleChange("property", val)}
            defaultValue="any">
            <SelectTrigger id="property" className="w-24 shrink-0 rounded-xs border shadow">
              <SelectValue placeholder="Select a Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="[&_div:focus]:bg-primary [&_div:focus]:text-primary-foreground">
                {["any", "apartment", "house", "condo", "land"].map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Min Price */}
        <div className="flex flex-col">
          <label htmlFor="minPrice" className="text-xs">
            Min Price
          </label>
          <Input
            id="minPrice"
            type="number"
            variant="simple"
            placeholder="Price"
            className="w-24 rounded-xs"
            min={0}
            step={100}
            value={query.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
        </div>

        {/* Max Price */}
        <div className="flex flex-col">
          <label htmlFor="maxPrice" className="text-xs">
            Max Price
          </label>
          <Input
            id="maxPrice"
            type="number"
            variant="simple"
            placeholder="Price"
            className="w-24 rounded-xs"
            min={0}
            step={100}
            value={query.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>

        {/* Bedrooms */}
        <div className="flex flex-col">
          <label htmlFor="bedroom" className="text-xs">
            Bedroom
          </label>
          <Input
            id="bedroom"
            type="number"
            variant="simple"
            placeholder="XX"
            className="w-24 rounded-xs"
            min={0}
            value={query.bedroom}
            onChange={(e) => handleChange("bedroom", e.target.value)}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-end mt-2">
        <Button type="submit" className="flex-auto max-w-full bg-primary h-12 rounded-none border-none flex items-center justify-center">
          <Search className="size-6" />
        </Button>
      </div>
    </form>
  );
};

export default Filter;