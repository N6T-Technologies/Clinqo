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

export const ClininRegFormDataSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    country: z.string().min(1, "Country is required"),
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip is required"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type ClininRegFormDataSchemaType = z.infer<typeof ClininRegFormDataSchema>;

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

export interface StepInfo {
    id: string;
    name: string;
    fields?: string[];
}

export interface StepperRefType {
    next: () => void;
    prev: () => void;
    currentStep: number;
}
