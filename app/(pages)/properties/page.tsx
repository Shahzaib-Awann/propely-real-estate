export const dynamic = "force-dynamic";



import { PropertiesQueryParamsInterface } from "@/lib/types/propely.type";
import { getProperties } from "@/lib/actions/properties.action";
import PropertiesClient from "@/components/pages/properties/properties-client-page";
import { Metadata } from "next";



/**
 * Generate SEO metadata dynamically based on search filters
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PropertiesQueryParamsInterface>;
}): Promise<Metadata> {
  const queryParams = await searchParams;

  // Used to build dynamic page title
  const titleSegments: string[] = [];

  // Buy / Rent
  if (queryParams.type) {
    titleSegments.push(queryParams.type.charAt(0).toUpperCase() + queryParams.type.slice(1));
  }

  // Property type (house, apartment, etc.)
  if (queryParams.property) {
    titleSegments.push(queryParams.property.charAt(0).toUpperCase() + queryParams.property.slice(1));
  } else {
    titleSegments.push("Properties");
  }

  // Location
  if (queryParams.location) {
    titleSegments.push(`in ${queryParams.location}`);
  }

  const title = `${titleSegments.join(" ")} | Real Estate`;

  const description = queryParams.location
    ? `Browse ${titleSegments.join(" ").toLowerCase()} with latest listings, prices, and locations.`
    : "Browse properties with latest listings, prices, and locations.";

  return {
    title,
    description,
  };
}



/**
 * Properties Page (Server Component)
 */
export default async function Properties({ searchParams }: { searchParams: Promise<PropertiesQueryParamsInterface>; }){

  const queryParams = await searchParams;

  // === Fetch properties from server ===
  const propertiesResponse = await getProperties(
    queryParams.search || undefined,
    Number(queryParams.page ?? 1),
    Number(queryParams.limit ?? 10),
    queryParams.type || undefined,
    queryParams.location || undefined,
    queryParams.minPrice || undefined,
    queryParams.maxPrice || undefined,
    queryParams.property || undefined,
    queryParams.bedroom ? Number(queryParams.bedroom) : undefined
  );

  return (
    <main className="flex flex-row h-[calc(100vh-80px)] px-4">
      <PropertiesClient
        key={JSON.stringify(queryParams)}
        initialItems={propertiesResponse.items}
        meta={propertiesResponse.meta}
        searchParams={queryParams}
      />
    </main>
  );
}