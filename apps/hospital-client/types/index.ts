import * as z from "zod";
import { ReactNode } from "react";
import { Gender } from "@repo/db/client";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const ClininRegFormDataSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    dateOfBirth: z.string().date(),
    gender: z.custom<Gender>(),
    contactNumber: z.string(),
    // countryCode: z.string().length(3, "Invalid country code").startsWith("+", "Country code must start with +"),
    clinicName: z.string().min(1, "Name of the Clinq is required"),
    // logo: z
    //     .instanceof(File)
    //     .optional()
    //     .refine((file) => {
    //         return !file || file.size <= MAX_FILE_SIZE;
    //     }, "File size must be less than 5MB"),
    // .refine((file) => {
    //     return ACCEPTED_IMAGE_TYPES.includes(file?.type || "");
    // }, "File must be either of png, jpeg, jpg, webp"),
    gstin: z.string().min(1, "GSTIN is required").length(15, "Invalid GSTIN"),
    country: z.string().min(1, "Country is required"),
    addressLine1: z.string().min(1, "Street is required"),
    addressLine2: z.string().min(1, "Street is required").optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required").length(6, "Pincode is required"),
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
