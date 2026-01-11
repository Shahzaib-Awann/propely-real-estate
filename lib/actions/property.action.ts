
import { postsTable, postDetailsTable, postFeaturesTable, postImagesTable } from "@/lib/db/schema";
import { db } from "../db/connection";
import { v6 as uuidv6 } from 'uuid';
import { parseLexicalContent } from "@/components/widgets/editor/plugins/utils";



export const addNewProperty = async (
    userId: number,
    postData: any,
    postImages: Array<{ imageUrl: string; publicId: string }>,
    postDetails: any,
    postFeatures?: Array<{ title: string; description: string }>
  ) => {
    const propertyId = uuidv6();
    const normalizedDescription = parseLexicalContent(postDetails.description);
  
    return await db.transaction(async (tx) => {
      // === Insert Post ===
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
        price: postData.price,
        propertyType: postData.propertyType,
        listingType: postData.listingType,
      });
  
      // === Insert Post Details ===
      await tx.insert(postDetailsTable).values({
        postId: propertyId,
        description: normalizedDescription,
        state: postDetails.state,
        areaSqft: postDetails.areaSqft,
        utilitiesPolicy: postDetails.utilitiesPolicy,
        schoolDistance: postDetails.schoolDistance,
        busDistance: postDetails.busDistance,
        restaurantDistance: postDetails.restaurantDistance,
        petPolicy: postDetails.petPolicy,
        incomePolicy: postDetails.incomePolicy,
      });
  
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
  
