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


const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


/** Zod schema to validate sign-up form inputs: name, email, and password. */
export const UpdateUserProfileFormSchema = z.object({
    avatar: z
    .instanceof(File, { message: "Image is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, and .webp formats are supported."
    )
    .nullable(),
    name: z.string("Invalid Name").min(2, "Name must be at 2 characters").max(50, "Name is too big"),
    email: z.email("Invalid email address").min(1, "Email is required"),
});
