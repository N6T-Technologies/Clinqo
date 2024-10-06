import * as z from "zod";
import { ReactNode } from "react";
import { Genders } from "@repo/db/client";

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

export const CliniqRegSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    dateOfBirth: z.string().date(),
    gender: z.custom<Genders>(),
    contactNumber: z
        .string()
        .min(1, "Contact number is required")
        .length(13, "Invalid contact number")
        .startsWith("+", "Country code is required"),
    clinicName: z.string().min(1, "Name of the Cliniq is required"),
    logo: z.string(),
    gstin: z.string().min(1, "GSTIN is required").length(15, "Invalid GSTIN"),
    country: z.string().min(1, "Country is required"),
    addressLine1: z.string().min(1, "Street is required"),
    addressLine2: z.string().min(1, "Street is required").optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required").length(6, "Pincode is required"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type CliniqRegSchemaType = z.infer<typeof CliniqRegSchema>;

export enum LoginActionsError {
    Invalid_Fields = "Invalid fields",
    User_Not_Found = "User not found",
    Invalid_Credentials = "Invalid credentials",
    Something_Went_Wrong = "Something went wrong",
}

export enum ClinicRegError {
    Invalid_Fields = "Invalid fields",
    Clinic_Already_Exits = "Clinic already exits",
    Clinic_Head_Already_Exits = "Clinic-Head already exits",
    Something_Went_Wrong = "Something went wrong",
    Unauthorized = "Unauthorized",
    No_Creadentials = "No Credentials",
    Admin_Not_Found = "Admin not found",
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

export type Clinic = {
    id: string;
    name: string;
    headName: string;
    headEmail: string;
};
