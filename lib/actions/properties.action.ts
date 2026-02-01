"use server";

import { postsTable, postImagesTable, savedPostsTable } from "@/lib/db/schema";
import { and, eq, gte, lte, like, sql, desc, asc, inArray } from "drizzle-orm";
import { db } from "../db/connection";
import { ListPropertyInterface, PropertiesResponse } from "../types/propely.type";
import { defaultAppSettings } from "../constants";
import { auth } from "@/auth";



/**
 * === Fetch paginated property listings with optional filters. ===
 *
 * Supports search, location, listing type, property type, price range,
 * bedroom count, and safe pagination using Drizzle ORM.
 *
 * @param search - Search keyword for property titles.
 * @param page - Page number (1-based).
 * @param limit - Number of items per page.
 * @param type - Listing type (`buy` | `rent`).
 * @param location - City or location filter.
 * @param minPrice - Minimum price filter.
 * @param maxPrice - Maximum price filter.
 * @param property - Property type filter.
 * @param bedroom - Bedroom count filter.
 *
 * @returns {Promise<PropertiesResponse>} - Paginated property results with metadata.
 * 
 */
export const getProperties = async (
  search: string | undefined,
  page: number,
  limit: number,
  type: string | undefined,
  location: string | undefined,
  minPrice: string | undefined,
  maxPrice: string | undefined,
  property: string | undefined,
  bedroom: number | undefined
): Promise<PropertiesResponse> => {

  const session = await auth();
  const viewerUserId = session?.user?.id
    ? Number(session.user.id)
    : null;

  // Ensure pagination values are always valid
  const safePage = Math.max(page, 1);
  const safeLimit = Math.max(limit, 10);
  const offset = (safePage - 1) * safeLimit;

  // Build WHERE conditions dynamically
  const conditions = [];

  // Search by title
  if (search) {
    conditions.push(like(postsTable.title, `%${search}%`));
  }

  // Filter by city / location
  if (location) {
    conditions.push(like(postsTable.city, `%${location}%`));
  }

  // Filter by listing type (buy | rent)
  if (type) {
    const t = type.toLowerCase().trim();
    if (['buy', 'rent'].includes(t)) {
      conditions.push(eq(postsTable.listingType, t as typeof postsTable.listingType.enumValues[number]));
    }
  }

  // Filter by property type (apartment, house, etc.)
  if (property) {
    const p = property.toLowerCase().trim();
    if (['apartment', 'house', 'condo', 'land'].includes(p)) {
      conditions.push(eq(postsTable.propertyType, p as typeof postsTable.propertyType.enumValues[number]));
    }
  }

  // Minimum price filter
  if (minPrice && !isNaN(Number(minPrice))) {
    conditions.push(gte(postsTable.price, minPrice));
  }

  // Maximum price filter
  if (maxPrice && !isNaN(Number(maxPrice))) {
    conditions.push(lte(postsTable.price, maxPrice));
  }

  // Bedroom count filter
  if (bedroom !== undefined) {
    conditions.push(eq(postsTable.bedrooms, bedroom));
  }

  // Fetch paginated property items
  const items = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      bedRooms: postsTable.bedrooms,
      bathRooms: postsTable.bathrooms,
      price: postsTable.price,
      address: postsTable.address,
      location: postsTable.city,
      ptype: postsTable.propertyType,
      ltype: postsTable.listingType,
      latitude: postsTable.latitude,
      longitude: postsTable.longitude,
    })
    .from(postsTable)
    .orderBy(desc(postsTable.createdAt))
    .where(and(...conditions))
    .limit(safeLimit)
    .offset(offset);

    const postIds = items.map((i) => i.id);
  
    // 2) Fetch FIFO images for those posts
  const images = postIds.length
  ? await db
      .select({
        postId: postImagesTable.postId,
        url: postImagesTable.imageUrl,
      })
      .from(postImagesTable)
      .where(inArray(postImagesTable.postId, postIds))
      .orderBy(postImagesTable.id) // FIFO
  : [];

// Build a map: postId -> first image
const imageMap = new Map<string, string>();
for (const img of images) {
  if (img.url && !imageMap.has(img.postId)) {
    imageMap.set(img.postId, img.url);
  }
}

  // Saved Posts (Bookmarks)

let savedPostSet = new Set<string>();

if (viewerUserId && postIds.length > 0) {
  const saved = await db
    .select({ postId: savedPostsTable.postId })
    .from(savedPostsTable)
    .where(
      and(
        eq(savedPostsTable.userId, viewerUserId),
        inArray(savedPostsTable.postId, postIds)
      )
    );

  savedPostSet = new Set(saved.map((s) => s.postId));
}

// 3) Attach image (or fallback)
 const normalizedItems = items.map((item) => ({
    ...item,
    img: imageMap.get(item.id) ?? defaultAppSettings.placeholderPostImage,
    isSaved: viewerUserId ? savedPostSet.has(item.id) : false,
  }));

  // Count total matching records (for pagination)
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(postsTable)
    .where(and(...conditions));

  const totalPage = Math.ceil(total / safeLimit);

  // Return items with pagination metadata
  return {
    meta: {
      search,
      location,
      minPrice: minPrice ? Number(minPrice) : 0,
      maxPrice: maxPrice ? Number(maxPrice) : 0,
      bedroom,
      page: safePage,
      limit: safeLimit,
      totalPage,
      totalItems: total,
    },
    items: normalizedItems,
  };
};



/**
 * === Fetch a list of properties for a specific user. ===
 *
 * Retrieves all properties created by the given user with key details 
 * (bedrooms, bathrooms, price, address, location, type) and attaches the first image to each. Returns an empty array if none exist.
 *
 * @param {number} userId - ID of the user whose properties to fetch.
 * @returns {Promise<ListPropertyInterface[]>} A list of normalized property objects,
 * each containing property details and a representative image URL.
 */
export const getMyPropertiesList = async (
  userId: number,
  viewerUserId?: number | null
): Promise<ListPropertyInterface[]> => {

  // Fetch properties
  const items = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      bedRooms: postsTable.bedrooms,
      bathRooms: postsTable.bathrooms,
      price: postsTable.price,
      address: postsTable.address,
      location: postsTable.city,
      ptype: postsTable.propertyType,
      ltype: postsTable.listingType,
      latitude: postsTable.latitude,
      longitude: postsTable.longitude,
    })
    .from(postsTable)
    .where(eq(postsTable.sellerId, userId))
    .orderBy(desc(postsTable.createdAt));

  if (items.length === 0) return [];

  const postIds = items.map((i) => i.id);

  /**
   * === Images ===
   */
  const images = await db
    .select({
      postId: postImagesTable.postId,
      url: postImagesTable.imageUrl,
    })
    .from(postImagesTable)
    .where(inArray(postImagesTable.postId, postIds))
    .orderBy(asc(postImagesTable.id));

  const imageMap = new Map<string, string>();
  for (const img of images) {
    if (img.url && !imageMap.has(img.postId)) {
      imageMap.set(img.postId, img.url);
    }
  }

  /**
   * === Saved Posts (only if logged in) ===
   */
  let savedPostSet = new Set<string>();

  if (viewerUserId) {
    const saved = await db
      .select({ postId: savedPostsTable.postId })
      .from(savedPostsTable)
      .where(
        and(
          inArray(savedPostsTable.postId, postIds),
          eq(savedPostsTable.userId, viewerUserId)
        )
      );

    savedPostSet = new Set(saved.map((s) => s.postId));
  }

  /**
   * === Normalize ===
   */
  const normalizedItems: ListPropertyInterface[] = items.map((item) => ({
    ...item,
    img: imageMap.get(item.id) ?? defaultAppSettings.placeholderPostImage,
    isSaved: viewerUserId ? savedPostSet.has(item.id) : false,
  }));

  return normalizedItems;
};



export async function toggleBookmark(postId: string): Promise<{ success: boolean, message: string }> {

  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized access");
  
  const userId = Number(session.user.id);

  const [existing] = await db.select().from(savedPostsTable).where(and(
      eq(savedPostsTable.userId, userId),
      eq(savedPostsTable.postId, postId)
    ));

  // Remove the Bookmark
  if (existing) {
    await db
      .delete(savedPostsTable)
      .where(
        and(
          eq(savedPostsTable.userId, userId),
          eq(savedPostsTable.postId, postId)
        )
      );

    return { success: true, message: "Property removed from saved list" };
  }

  // add bookmark
  await db.insert(savedPostsTable).values({
    userId,
    postId,
  });

  return { success: true, message: "Property added to saved list" };
}