"use server";

import { postsTable, postDetailsTable, postFeaturesTable, postImagesTable, usersTable } from "@/lib/db/schema";
import { db } from "../db/connection";
import { v6 as uuidv6 } from 'uuid';
import { parseLexicalContent } from "@/components/widgets/editor/plugins/utils";
import { createOrUpdatePostSchema } from "../zod/schema.zod";
import z from "zod";
import { and, asc, eq, inArray, InferInsertModel, not } from "drizzle-orm";
import { PostImages, SinglePostDetails, SinglePostDetailsForEdit, SinglePostSEO } from "../types/propely.type";
import { SerializedEditorState } from "lexical";
import { defaultAppSettings } from "../constants";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { deleteCloudinaryAssets } from "./cloudinary.action";



type CreatePostInput = z.infer<typeof createOrUpdatePostSchema>;
type PostDataInput = CreatePostInput["postData"];
type PostDetailsInput = CreatePostInput["postDetails"];
type PostImagesInput = CreatePostInput["postImages"];
type PostFeaturesInput = CreatePostInput["postFeatures"];
type PostDetailsInsert = InferInsertModel<typeof postDetailsTable>;



/**
 * === Create a new property post. ===
 *
 * Inserts a property post along with its details, images, and features
 * in a single atomic transaction.
 *
 * @param userId - ID of the property owner (seller).
 * @param postData - Core post information.
 * @param postImages - Property image list.
 * @param postDetails - Additional property details.
 * @param postFeatures - Property feature list.
 * @returns {Promise<{ propertyId: string }>} Newly created property ID.
 */
export const addNewProperty = async (
    userId: number,
    postData: PostDataInput,
  postImages: PostImagesInput,
  postDetails: PostDetailsInput,
  postFeatures: PostFeaturesInput
  ): Promise<{ propertyId: string }> => {

    // === Generate unique property ID ===
    const propertyId = uuidv6();

    // === Normalize Lexical description to JSON-safe format ===
    const normalizedDescription = parseLexicalContent(postDetails.description, "to-json") ?? {};;
  
    return await db.transaction(async (tx) => {
      // === Insert base Post ===
      await tx.insert(postsTable).values({
        id: propertyId,
        sellerId: userId,
        title: postData.title,
        address: postData.address,
        city: postData.city,
        bedrooms: postData.bedrooms,
        bathrooms: postData.bathrooms,
        latitude: String(postData.latitude),
        longitude: String(postData.longitude),
        price: String(postData.price),
        propertyType: postData.propertyType,
        listingType: postData.listingType,
      });
  
      // === Insert Post Details ===
      const detailsValues: PostDetailsInsert = {
        postId: propertyId,
        description: normalizedDescription ?? {}, // JSON-safe
        state: postDetails.state,
        areaSqft: postDetails.areaSqft,
        utilitiesPolicy: postDetails.utilitiesPolicy,
        schoolDistance: postDetails.schoolDistance,
        busDistance: postDetails.busDistance,
        restaurantDistance: postDetails.restaurantDistance,
        petPolicy: postDetails.petPolicy,
        incomePolicy: postDetails.incomePolicy,
      };
      
      await tx.insert(postDetailsTable).values(detailsValues);
  
      // === Insert Images ===
      if (postImages?.length) {
        await tx.insert(postImagesTable).values(
          postImages.map((img) => ({
            postId: propertyId,
            imageUrl: img.imageUrl,
            imagePublicId: img.publicId,
          }))
        );
      }
  
      // === Insert Features ===
      if (postFeatures?.length) {
        await tx.insert(postFeaturesTable).values(
          postFeatures.map((f) => ({
            postId: propertyId,
            title: f.title,
            description: f.description,
          }))
        );
      }
  
      return { propertyId };
    });
};



/**
 * === Fetch single post (property) details by post ID For Edit. ===
 *
 * Retrieves base post data, images, and features,
 * then normalizes everything into a single response object.
 *
 * @param postId - ID of the post to retrieve.
 * @param userId - ID of the user to retrieve.
 * @returns {Promise<SinglePostDetailsForEdit | null>} Normalized post details or `null` if not found.
 */
export const getPostByIdForEdit = async (postId: string, userId: number): Promise<SinglePostDetailsForEdit | null> => {

  // Fetch base post + details
  const [post] = await db.select({
    id: postsTable.id,
    title: postsTable.title,
    price: postsTable.price,
    bedRooms: postsTable.bedrooms,
    bathroom: postsTable.bathrooms,
    size: postDetailsTable.areaSqft,
    state: postDetailsTable.state,
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
    .where(and(eq(postsTable.id, postId), eq(postsTable.sellerId, userId)))
    .leftJoin(postDetailsTable, eq(postDetailsTable.postId, postId));

  // Return null if post not found
  if (!post) return null;

  // Fetch related data [Post Images, Post Features, Seller Info] in parallel
  const [postImages, postFeatures] = await Promise.all([
    db
      .select({ id: postImagesTable.id, imageUrl: postImagesTable.imageUrl, publicId: postImagesTable.imagePublicId })
      .from(postImagesTable)
      .where(eq(postImagesTable.postId, postId))
      .orderBy(asc(postImagesTable.id)),
    db.select({
      id: postFeaturesTable.id,
      title: postFeaturesTable.title,
      description: postFeaturesTable.description,
    })
      .from(postFeaturesTable)
      .where(eq(postFeaturesTable.postId, postId)),
  ]);

  // Normalize image list (gallery)
  const imagesArray: PostImages[] =
  postImages.length > 0
    ? postImages
        .filter((img) => img.imageUrl && img.publicId)
        .map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl!,
          publicId: img.publicId!,
        }))
    : [
        {
          imageUrl: defaultAppSettings.placeholderPostImage,
          publicId: "",
        },
      ];
   
  // Normalize the return output
  const normalize: SinglePostDetailsForEdit = {
    id: post.id,
    title: post.title,

    // description: typeof post.description === "string"
    //   ? post.description
    //   : (post.description as SerializedEditorState),

    description: parseLexicalContent(post.description, "to-lexical") as string,

    price: post.price,
    size: post.size ?? 0,
    state: post.state ?? "",

    images: imagesArray,

    bedRooms: post.bedRooms,
    bathroom: post.bathroom,
    features: postFeatures ?? [],
    
    utilities: post.utilities ?? 'shared',
    petPolicy: post.petPolicy ?? 'not-allowed',
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

    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }

  return normalize
}



/**
 * === Edit an existing property post. ===
 *
 * Updates a property post and its related entities (details, images, and features)
 * in a single atomic transaction. Only the owner (seller) of the property is allowed
 * to perform the update.
 *
 * The operation includes:
 * - Updating the base post information.
 * - Updating extended property details.
 * - Synchronizing images (update existing, insert new, remove missing).
 * - Synchronizing features (update existing, insert new, remove missing).
 *
 * @param userId - ID of the property owner (seller).
 * @param postData - Core post information, must include the property ID.
 * @param postImages - Property image list to be synced with the database.
 * @param postDetails - Additional property details.
 * @param postFeatures - Property feature list to be synced with the database.
 *
 * @throws {Error} If the property ID is missing from `postData`.
 *
 * @returns {Promise<{ propertyId: string }>} Updated property ID.
 */
export const editProperty = async (
  userId: number,
  postData: PostDataInput,
  postImages: PostImagesInput,
  postDetails: PostDetailsInput,
  postFeatures: PostFeaturesInput
): Promise<{ propertyId: string }> => {

  // === Get property ID ===
  const propertyId = postData.id;

  // === If Property ID not Found in data === 
  if (!propertyId) {
    throw new Error("Property ID is required for edit a property");
  }

  // === Normalize Lexical description to JSON-safe format ===
  const normalizedDescription =
    parseLexicalContent(postDetails.description, "to-json") ?? {};

  return await db.transaction(async (tx) => {

    // === Update base Post ===
    const result = await tx
      .update(postsTable)
      .set({
        title: postData.title,
        address: postData.address,
        city: postData.city,
        bedrooms: postData.bedrooms,
        bathrooms: postData.bathrooms,
        latitude: String(postData.latitude),
        longitude: String(postData.longitude),
        price: String(postData.price),
        propertyType: postData.propertyType,
        listingType: postData.listingType,
      })
      .where(
        and(eq(postsTable.id, propertyId), eq(postsTable.sellerId, userId))
      );

      // Get the number of rows affected by the update
      const affected = result[0]?.affectedRows ?? 0;
    
      // No rows updated: unauthorized or post not found
    if (affected === 0) {
      throw new Error("You are not allowed to edit this property");
    }     

    // === Update Post Details ===
    await tx
      .update(postDetailsTable)
      .set({
        description: normalizedDescription,
        state: postDetails.state,
        areaSqft: postDetails.areaSqft,
        utilitiesPolicy: postDetails.utilitiesPolicy,
        schoolDistance: postDetails.schoolDistance,
        busDistance: postDetails.busDistance,
        restaurantDistance: postDetails.restaurantDistance,
        petPolicy: postDetails.petPolicy,
        incomePolicy: postDetails.incomePolicy,
      })
      .where(eq(postDetailsTable.postId, propertyId));

    // === Handle Images ===
    if (postImages?.length) {
      const existingImageIds = postImages
        .filter((i) => i.id)
        .map((i) => i.id!) as number[];

      // remove images that are no longer present in payload
      if (existingImageIds.length) {
        await tx.delete(postImagesTable).where(
          and(
            eq(postImagesTable.postId, propertyId),
            not(inArray(postImagesTable.id, existingImageIds))
          )
        );
      }

      for (const img of postImages) {
        if (img.id) {
          // Update existing images
          await tx
            .update(postImagesTable)
            .set({
              imageUrl: img.imageUrl,
              imagePublicId: img.publicId,
            })
            .where(and(eq(postImagesTable.id, img.id), eq(postImagesTable.postId, propertyId)));
        } else {
          // Insert new images
          await tx.insert(postImagesTable).values({
            postId: propertyId,
            imageUrl: img.imageUrl,
            imagePublicId: img.publicId,
          });
        }
      }
    }

    // === Handle Features ===
    if (postFeatures?.length) {
      const existingFeatureIds = postFeatures
        .filter((f) => f.id)
        .map((f) => f.id!) as number[];

      // remove features that are no longer present in payload
      if (existingFeatureIds.length) {
        await tx.delete(postFeaturesTable).where(
          and(
            eq(postFeaturesTable.postId, propertyId),
            not(inArray(postFeaturesTable.id, existingFeatureIds))
          ));
      }

      for (const f of postFeatures) {
        if (f.id) {
          // Update existing feature
          await tx
            .update(postFeaturesTable)
            .set({
              title: f.title,
              description: f.description,
            })
            .where(and(eq(postFeaturesTable.id, f.id),eq(postFeaturesTable.postId, propertyId)));
        } else {
          // Insert new feature
          await tx.insert(postFeaturesTable).values({
            postId: propertyId,
            title: f.title,
            description: f.description,
          });
        }
      }
    }

    return { propertyId };
  });
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



/**
 * === Delete a single property (post) by post ID. ===
 *
 * Ensures the user is authenticated and owns the property,
 * deletes associated Cloudinary images first,
 * then removes the post from the database (with cascades).
 *
 * @param postId - ID of the post to delete.
 * @returns {Promise<{ success: boolean }>} Deletion status.
 *
 * @throws UNAUTHORIZED - If the user is not logged in.
 * @throws NOT_FOUND_OR_FORBIDDEN - If the post does not exist or user is not the owner.
 * @throws DELETE_FAILED - If an unexpected error occurs.
 */
export async function deletePropertyById(postId: string): Promise<{ success: boolean }> {

  // === Authenticate User ===
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    throw new Error("Unauthorized access");
  }

  // Fetch Cloudinary publicIds (ownership enforced)
  try {
    const images = await db
      .select({ publicId: postImagesTable.imagePublicId })
      .from(postImagesTable)
      .innerJoin(postsTable, eq(postsTable.id, postImagesTable.postId))
      .where(
        and(
          eq(postsTable.id, postId),
          eq(postsTable.sellerId, Number(userId))
        )
      );

    // Normalize valid Cloudinary public IDs
    const publicIds = images
      .map((i) => i.publicId)
      .filter((id): id is string => typeof id === "string");

    // Delete images from Cloudinary
    if (publicIds.length > 0) {
      try {
        await deleteCloudinaryAssets(publicIds);
      } catch (error) {
        console.warn("Failed to delete property images from Cloudinary: ", error);
        // Intentionally continue — DB delete still happens
      }
    }

    // Delete post (DB cascades details, images, features)
    const result = await db
      .delete(postsTable)
      .where(
        and(
          eq(postsTable.id, postId),
          eq(postsTable.sellerId, Number(userId))
        )
      );

    // If nothing was deleted, post doesn't exist or user isn't the owner
    if (result[0].affectedRows === 0) {
      throw new Error("Property not found or access denied");
    }

    // Revalidate
    revalidatePath("/profile");

    return { success: true };

  } catch (error) {
    console.error("Property deletion error: ", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to delete property");
  }
}