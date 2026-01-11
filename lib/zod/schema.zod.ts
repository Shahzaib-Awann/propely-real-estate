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
  id: z.number().nullable(),

  title: z.string("Title is required").min(3, "Title must be at least 3 characters").max(255, "Title must not exceed 255 characters"),
  address: z.string("Address is required").min(3, "Address must be at least 3 characters").max(255, "Address must not exceed 255 characters"),
  city: z.string("City is required").min(2, "City must be at least 2 characters").max(100, "City must not exceed 100 characters"),

  bedrooms: z.number("Bedrooms must be a number").min(0, "Bedrooms cannot be negative"),
  bathrooms: z.number("Bathrooms must be a number").min(0, "Bathrooms cannot be negative"),

  latitude: z.number("Latitude must be a number").min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.number("Longitude must be a number").min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),

  price: z.number("Price must be a number").positive("Price must be greater than zero"),

  propertyType: z.enum(["apartment", "house", "condo", "land"], "Property type is required"),
  listingType: z.enum(["buy", "rent"], "Listing type is required"),
});


/**
 * Zod schema for Post Details table.
 */
export const postDetailsSchema = z.object({
  description: z.string("Description is required").min(10, "Description must be at least 10 characters").nullable(),
  state: z.string("State is required").min(2, "State must be at least 2 characters").max(100, "State must not exceed 100 characters"),
  areaSqft: z.number("Area (sqft) must be a number").positive("Area (sqft) must be greater than zero"),

  schoolDistance: z.number("School distance must be a string").min(0, "School distance required"),
  busDistance: z.number("Bus distance must be a string").min(0, "Bus distance required"),
  restaurantDistance: z.number("Restaurant distance must be a string").min(0, "Restaurant distance required"),

  utilitiesPolicy: z.string(),
  petPolicy: z.string(),
  incomePolicy: z.string("Income policy is required"),
});


/**
 * Zod schema for a single post image.
 */
export const postImageSchema = z.object({
  id: z.number().nullable(),
  imageUrl: z.string(),
  publicId: z.string(),
});

/**
 * Zod schema for post images list.
 * At least one image is required.
 */
export const postImagesSchema = z.array(postImageSchema);

/**
 * Zod schema for a single post feature.
 */
export const postFeatureSchema = z.object({
  id: z.number().nullable(),
  title: z.string().min(2, "Title must be at least 2 characters").max(50, "Title must not exceed 50 characters"),
  description: z.string().min(2, "Description must be at least 2 characters").max(50, "Description must not exceed 50 characters"),
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
  postData: postSchema,
  postDetails: postDetailsSchema,
  postImages: postImagesSchema,
  postFeatures: postFeaturesSchema,
});