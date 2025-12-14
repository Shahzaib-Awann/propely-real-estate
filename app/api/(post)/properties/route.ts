import { getProperties } from "@/lib/actions/properties.action";
import { NextRequest, NextResponse } from "next/server";



/*=============================================================
=== [GET] Fetch paginated properties with optional filters. ===
============================================================ */
export async function GET(req: NextRequest) {
  try {
    const queryParams = req.nextUrl.searchParams;

    // Parse pagination values safely
    const pageNumber = Number(queryParams.get("page") ?? 1);
    const itemsPerPage = Number(queryParams.get("limit") ?? 5);

    // Parse bedroom filter safely
    const bedrooms = queryParams.get("bedroom")
      ? Number(queryParams.get("bedroom"))
      : undefined;

    // Fetch properties using the action function
    const propertiesData = await getProperties(
      queryParams.get("search") ?? undefined,
      pageNumber,
      itemsPerPage,
      queryParams.get("type") ?? undefined,
      queryParams.get("location") ?? undefined,
      queryParams.get("minPrice") ?? undefined,
      queryParams.get("maxPrice") ?? undefined,
      queryParams.get("property") ?? undefined,
      bedrooms
    );

    // Return response as JSON
    return NextResponse.json(propertiesData);
  } catch (error) {
    console.error("Failed to fetch properties:", error);

    return NextResponse.json(
      { error: "An error occurred while fetching properties." },
      { status: 500 }
    );
  }
}
