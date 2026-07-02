"use client";

import { useState, useTransition } from "react";
import Filter from "./filter";
import MapWrapper from "@/components/widgets/map/map-wrapper";
import { Button } from "@/components/ui/button";
import { buildSearchParams } from "@/lib/utils/general";
import ListClient from "./list-client";
import {
  ListPropertiesMeta,
  ListPropertyInterface,
  PropertiesQueryParamsInterface,
} from "@/types/propely.type";
import { Building2, RotateCcw, SearchX } from "lucide-react";
import Link from "next/link";

/**
 * Props for PropertiesClient component
 */
interface PropertiesClientProps {
  initialItems: ListPropertyInterface[];
  meta: ListPropertiesMeta;
  searchParams: PropertiesQueryParamsInterface;
}

/**
 * Client-side component to display property listings, filters, and map
 */
export default function PropertiesClient({
  initialItems,
  meta,
  searchParams,
}: PropertiesClientProps) {
  // === Local States ===
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(meta.page ?? 1);
  const [isPending, startTransition] = useTransition();

  // True if more items are available to load
  const hasMore = page * meta.limit < meta.totalItems;

  // === Load more items (pagination) ===
  const loadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;

      // Build query params
      const params = buildSearchParams(searchParams);
      params.set("page", String(nextPage));
      params.set("limit", String(meta.limit));

      // Fetch next page
      const response = await fetch(`/api/properties?${params.toString()}`);
      const data = await response.json();

      // Add items and update page
      setItems((prev) => [...prev, ...data.items]);
      setPage(nextPage);
    });
  };

  const hasFilters = [
    searchParams.search,
    searchParams.location,
    searchParams.type,
    searchParams.property,
    searchParams.minPrice,
    searchParams.maxPrice,
    searchParams.bedroom,
  ].some(Boolean);

  return (
    <>
      {/* Property listings and filters section */}
      <section className="flex-3 h-full overflow-hidden pl-4 lg:pl-0">
        <div className="h-full flex flex-col gap-10 pr-4 lg:pr-10 py-5 overflow-y-scroll pb-12">
          {/* Filter component */}
          <Filter params={searchParams} />

          {/* Property cards */}
          <div className="grid grid-cols-1 gap-8">
            {items.length === 0 ? (
              hasFilters ? (
                <div className="rounded-2xl border bg-card p-12 lg:p-16">
                  <div className="mx-auto flex max-w-lg flex-col items-center text-center">
                    <SearchX className="size-12 text-primary mb-6" />

                    <h2 className="text-2xl font-semibold">
                      No Matching Properties
                    </h2>

                    <p className="mt-3 text-muted-foreground">
                      We couldn&apos;t find properties matching your filters.
                    </p>

                    <Link href="/properties" className="mt-6">
                      <Button>
                        <RotateCcw className="size-4 mr-2" />
                        Reset Filters
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border bg-card p-12 lg:p-16">
                  <div className="mx-auto flex max-w-lg flex-col items-center text-center">
                    <Building2 className="size-12 text-primary mb-6" />

                    <h2 className="text-2xl font-semibold">
                      No Properties Available
                    </h2>

                    <p className="mt-3 text-muted-foreground">
                      There are currently no property listings on Propely. Check
                      back later or be the first to publish a property.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <ListClient list={items} />
            )}
          </div>

          {/* Load more button */}
          {hasMore && (
            <Button
              onClick={loadMore}
              disabled={isPending || !hasMore}
              className="mx-auto"
            >
              {isPending ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      </section>

      {/* Map section (desktop only) */}
      <aside className="hidden lg:block flex-2 h-full bg-side-panel py-5">
        <MapWrapper items={items} className="rounded-lg" />
      </aside>
    </>
  );
}
