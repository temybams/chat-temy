import { z } from 'zod';

const SignupSchema = z.object({
    fullname: z.string().min(3, "Full name is required").trim(),
    username: z.string().min(1, "Username is required").trim(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    gender: z.enum(["male", "female"]).refine(
        (val) => val === "male" || val === "female",
        {
            message: "Gender must be either 'male' or 'female'",
        }
    ),
    profilePic: z.string().optional()
});


const signinSchema = z.object({
    username: z.string().min(1, "Username is required").trim(),
    password: z.string().min(1, "Password is required"),
});
