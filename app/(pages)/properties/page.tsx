export const dynamic = "force-dynamic";



import { getProperties } from "@/lib/actions/properties.action";
import PropertiesClient from "@/components/pages/properties/properties-client-page";
import { PropertiesQueryParamsInterface } from "@/types/propely.type";
import { generateSEO } from "@/lib/seo";



/**
 * Generate SEO metadata dynamically based on search filters
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PropertiesQueryParamsInterface>;
}) {
  const query = await searchParams;

  const listingType =
    query.type === "sale"
      ? "For Sale"
      : query.type === "rent"
        ? "For Rent"
        : "";

  const propertyType = query.property
    ? query.property.charAt(0).toUpperCase() +
      query.property.slice(1)
    : "Properties";

  const location = query.location?.trim();

  const titleParts = [
    propertyType,
    listingType,
    location ? `in ${location}` : "",
  ].filter(Boolean);

  const title = `${titleParts.join(" ")}`;

  const description = location
    ? `Browse ${propertyType.toLowerCase()} ${listingType.toLowerCase()} in ${location}. Explore verified listings, property prices, photos, amenities, and connect directly with property owners and agents.`
    : `Browse verified properties for sale and rent across Pakistan. Discover houses, apartments, plots, commercial properties, and investment opportunities on Propely.`;

  return generateSEO({
    title,
    description,
    path: "/properties",

    keywords: [
      propertyType,
      listingType,
      location ?? "",
      "property listings",
      "real estate",
      "houses",
      "apartments",
      "plots",
      "commercial property",
      "buy property",
      "rent property",
      "Pakistan real estate",
    ].filter(Boolean),
  });
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
    <main className="flex flex-row h-[calc(100vh-80px)] lg:px-4">
      <PropertiesClient
        key={JSON.stringify(queryParams)}
        initialItems={propertiesResponse.items}
        meta={propertiesResponse.meta}
        searchParams={queryParams}
      />
    </main>
  );
}