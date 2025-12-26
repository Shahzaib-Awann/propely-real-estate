import z from "zod";

/** Zod schema to validate sign-in form inputs: email and password. */
export const SignInFormSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required").min(6, "Password must be more than 6 characters").max(32, "Password must be less than 32 characters"),
});

/** Zod schema to validate sign-up form inputs: name, email, and password. */
export const SignUpFormSchema = z.object({
    name: z.string("Invalid Name").min(2, "Name must be at 2 characters").max(50, "Name is too big"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required").min(6, "Password must be more than 6 characters").max(32, "Password must be less than 32 characters"),
});

/** Zod schema to validate sign-up form inputs: name, email, and password. */
export const UpdateUserProfileFormSchema = z.object({
    name: z.string("Invalid Name").min(2, "Name must be at 2 characters").max(50, "Name is too big"),
    email: z.email("Invalid email address").min(1, "Email is required"),
});

/**
 * Zod schema to validate Property (Post) main table inputs.
 */
export const postSchema = z.object({
    id: z.union([z.string(), z.number()]).transform((val) => Number(val)).nullable(),

    title: z.string().min(3).max(255),
  
    address: z.string().min(3).max(255),
    city: z.string().min(2).max(100),
  
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
  
    latitude: z.string().min(1),
    longitude: z.string().min(1),
  
    price: z.number().positive(),
  
    propertyType: z.enum(["apartment", "house", "condo", "land"]),
    listingType: z.enum(["buy", "rent"]),
  });
  
  /**
   * Zod schema for Post Details table.
   */
  export const postDetailsSchema = z.object({
    id: z.union([z.string(), z.number()]).transform((val) => Number(val)).nullable(),

    description: z.string().min(10),
  
    state: z.string().min(2).max(100),
  
    areaSqft: z.number().int().positive(),
  
    utilitiesPolicy: z.string().default("none"),
  
    schoolDistance: z.string().max(15).optional().nullable(),
    busDistance: z.string().max(15).optional().nullable(),
    restaurantDistance: z.string().max(15).optional().nullable(),
  
    petPolicy: z.string().default("none").optional(),
    incomePolicy: z.string().default("none"),
  });
  
  /**
   * Zod schema for a single post image.
   */
  export const postImageSchema = z.object({
    id: z.union([z.string(), z.number()]).transform((val) => Number(val)).nullable(),
    imageUrl: z.string().url(),
  });
  
  /**
   * Zod schema for post images list.
   * At least one image is required.
   */
  export const postImagesSchema = z.array(postImageSchema).min(1);
  
  /**
   * Zod schema for a single post feature.
   */
  export const postFeatureSchema = z.object({
    id: z.union([z.string(), z.number()]).transform((val) => Number(val)).nullable(),
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(50),
  });
  
  /**
   * Zod schema for post features list.
   */
  export const postFeaturesSchema = z.array(postFeatureSchema).optional();
  
  /**
   * Combined schema for creating or updating a property post.
   * This is the schema you should use in forms & server actions.
   */
  export const createOrUpdatePostSchema = z.object({
    post: postSchema,
    details: postDetailsSchema,
    images: postImagesSchema,
    features: postFeaturesSchema,
  });
