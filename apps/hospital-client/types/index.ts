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
    contactNumber: z
        .string()
        .min(1, "Contact number is required")
        .length(13, "Invalid contact number")
        .startsWith("+", "Country code is required"),
    clinicName: z.string().min(1, "Name of the Clinq is required"),
    // logo: z
    //     .any()
    //     .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    //     .refine(
    //         (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    //         "Only .jpg, .jpeg, .png and .webp formats are supported."
    //     ),
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
