import z from "zod";

export const SignInFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignUpFormSchema = z.object({
    name: z.string("Invalid Name").min(2, "Name must be at 2 characters").max(50, "Name is too big"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});