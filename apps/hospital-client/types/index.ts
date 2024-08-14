import * as z from "zod";
import { ReactNode } from "react";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export enum LoginActionsError {
    "Invalid fields",
    "User not found",
    "Invalid credentials",
    "Something went wrong",
}

export interface Route {
    href: string;
    icon: ReactNode;
    title: string;
}
