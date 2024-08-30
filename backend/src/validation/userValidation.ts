import { z } from 'zod';

const SignupSchema = z.object({
    fullname: z.string().min(3, "Full name is required").trim(),
    email: z.string().min(1, "Email is required").trim(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    gender: z.enum(["male", "female"]),
    profilePic: z.string().optional(),
});

const LoginSchema = z.object({
    email: z.string().min(1, "Email is required").trim(),
    password: z.string().min(1, "Password is required"),
});

export { SignupSchema, LoginSchema };
