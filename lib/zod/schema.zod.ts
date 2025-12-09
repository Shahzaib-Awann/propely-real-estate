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
