"use client";

import { useState, useTransition } from "react";
import { ListPropertyInterface, ListPropertiesMeta, PropertiesQueryParamsInterface } from "@/lib/types/propely.type";
import Filter from "./filter";
import ListCard from "./list-card";
import MapWrapper from "@/components/map/map-wrapper";
import { Button } from "@/components/ui/button";
import { buildSearchParams } from "@/lib/utils";

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
            const response = await fetch(
                `/api/properties?${params.toString()}`
            );
            const data = await response.json();

            // Add items and update page
            setItems(prev => [...prev, ...data.items]);
            setPage(nextPage);
        });
    };

    return (
        <>
            {/* Property listings and filters section */}
            <section className="flex-3 h-full overflow-hidden">
                <div className="h-full flex flex-col gap-10 pr-4 lg:pr-10 py-5 overflow-y-scroll pb-12">

                    {/* Filter component */}
                    <Filter params={searchParams} />

                    {/* Property cards */}
                    <div className="grid grid-cols-1 gap-8">
                        {items.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No results found
                            </div>
                        ) : (
                            items.map(item => (
                                <ListCard key={item.id} item={item} />
                            ))
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