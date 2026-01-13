"use server";

import { postsTable, postDetailsTable, postFeaturesTable, postImagesTable, usersTable } from "@/lib/db/schema";
import { and, eq, gte, lte, like, sql, desc, asc, inArray } from "drizzle-orm";
import { db } from "../db/connection";
import { PropertiesResponse, SinglePostDetails, SinglePostSEO } from "../types/propely.type";
import { defaultAppSettings } from "../constants";
import { SerializedEditorState } from "lexical";



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

// 3) Attach image (or fallback)
const normalizedItems = items.map((item) => ({
  ...item,
  img: imageMap.get(item.id) ?? defaultAppSettings.placeholderPostImage,
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
 * === Fetch single post (property) by post ID For SEO. ===
 *
 * Retrieves base post required data, and images for SEO,
 * then normalizes everything into a single response object.
 *
 * @param postId - ID of the post to retrieve.
 * @returns {Promise<SinglePostSEO | null>} Normalized post details or `null` if not found.
 */
export const getPostSEOById = async (postId: string): Promise<SinglePostSEO | null> => {

  // Fetch the base post data required for SEO.
  const [post] = await db
    .select({
      id: postsTable.id,
      title: postsTable.title,
      city: postsTable.city,
      address: postsTable.address,
      price: postsTable.price,
      bedRooms: postsTable.bedrooms,
      bathroom: postsTable.bathrooms,
      ptype: postsTable.propertyType,
      ltype: postsTable.listingType,
    })
    .from(postsTable)
    .where(eq(postsTable.id, postId));

  // Return null if post not found
  if (!post) return null;

  // Fetch all gallery images associated with the post.
  const images = await db
    .select({ url: postImagesTable.imageUrl })
    .from(postImagesTable)
    .where(eq(postImagesTable.postId, postId))
    .orderBy(asc(postImagesTable.id));

  // Normalize image list
  const imagesArray = images
    .map((i) => i.url)
    .filter((url): url is string => typeof url === "string");

    // Fallback if no images exist
    const normalizedImages =
    imagesArray.length > 0
      ? imagesArray
      : [defaultAppSettings.placeholderPostImage];
   
  // Normalize the return output
  return {
    id: post.id,
    title: post.title,
    city: post.city,
    address: post.address,
    price: post.price,
    bedRooms: post.bedRooms,
    bathroom: post.bathroom,
    ptype: post.ptype,
    ltype: post.ltype,
    images: normalizedImages,
  };
}



/**
 * === Fetch single post (property) details by post ID. ===
 *
 * Retrieves base post data, images, features, and seller information,
 * then normalizes everything into a single response object.
 *
 * @param postId - ID of the post to retrieve.
 * @returns {Promise<SinglePostDetails | null>} Normalized post details or `null` if not found.
 */
export const getPostDetailsById = async (postId: string): Promise<SinglePostDetails | null> => {

  // Fetch base post + details
  const [post] = await db.select({
    id: postsTable.id,
    sellerId: postsTable.sellerId,
    title: postsTable.title,
    price: postsTable.price,
    bedRooms: postsTable.bedrooms,
    bathroom: postsTable.bathrooms,
    size: postDetailsTable.areaSqft,
    latitude: postsTable.latitude,
    longitude: postsTable.longitude,
    city: postsTable.city,
    ptype: postsTable.propertyType,
    ltype: postsTable.listingType,
    utilities: postDetailsTable.utilitiesPolicy,
    petPolicy: postDetailsTable.petPolicy,
    incomePolicy: postDetailsTable.incomePolicy,
    address: postsTable.address,
    school: postDetailsTable.schoolDistance,
    bus: postDetailsTable.busDistance,
    restaurant: postDetailsTable.restaurantDistance,
    description: postDetailsTable.description,
    updatedAt: postsTable.updatedAt,
    createdAt: postsTable.createdAt
  })
    .from(postsTable)
    .where(eq(postsTable.id, postId))
    .leftJoin(postDetailsTable, eq(postDetailsTable.postId, postId));

  // Return null if post not found
  if (!post) return null;

  // Fetch related data [Post Images, Post Features, Seller Info] in parallel
  const [postImages, postFeatures, sellerInfo] = await Promise.all([
    db
      .select({ url: postImagesTable.imageUrl })
      .from(postImagesTable)
      .where(eq(postImagesTable.postId, postId))
      .orderBy(postImagesTable.id),
    db.select({
      title: postFeaturesTable.title,
      description: postFeaturesTable.description,
    })
      .from(postFeaturesTable)
      .where(eq(postFeaturesTable.postId, postId)),
    db.select({
      id: usersTable.id,
      avatar: usersTable.avatar,
      name: usersTable.name,
      email: usersTable.email,
    })
      .from(usersTable)
      .where(eq(usersTable.id, post.sellerId)),
  ]);

  // Normalize image list (cover + gallery)
  const imagesArray =
    postImages.length > 0
      ? postImages
          .map((img) => img.url)
          .filter((url): url is string => typeof url === "string")
      : [defaultAppSettings.placeholderPostImage]; 
   
  // Normalize the return output
  const normalize: SinglePostDetails = {
    id: post.id,
    title: post.title,
    description: typeof post.description === "string"
      ? post.description
      : (post.description as SerializedEditorState),

    price: post.price,
    size: post.size ?? 0,

    images: imagesArray,

    bedRooms: post.bedRooms,
    bathroom: post.bathroom,
    features: postFeatures ?? [],
    
    utilities: post.utilities ?? "none",
    petPolicy: post.petPolicy ?? "none",
    incomePolicy: post.incomePolicy ?? "none",

    address: post.address,
    city: post.city,
    latitude: post.latitude,
    longitude: post.longitude,
    ptype: post.ptype,
    ltype: post.ltype,
    school: post.school,
    bus: post.bus,
    restaurant: post.restaurant,

    sellerInfo: sellerInfo[0] ?? null,

    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }

  return normalize
}