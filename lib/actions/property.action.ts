"use server";

import { postsTable, postDetailsTable, postFeaturesTable, postImagesTable } from "@/lib/db/schema";
import { db } from "../db/connection";
import { v6 as uuidv6 } from 'uuid';
import { parseLexicalContent } from "@/components/widgets/editor/plugins/utils";
import { createOrUpdatePostSchema } from "../zod/schema.zod";
import z from "zod";
import { InferInsertModel } from "drizzle-orm";



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
    const normalizedDescription = parseLexicalContent(postDetails.description) ?? {};
  
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
  
