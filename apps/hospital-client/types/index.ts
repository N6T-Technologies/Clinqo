import * as z from "zod";
import { ReactNode } from "react";
import { Genders, PaymentMethod } from "@repo/db/client";
import { Status } from "shefu/appointments";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; //5 MB
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
    //TODO:: finish the drag and drop component using following zod type
    // logo: z
    //     .instanceof(File)
    //     .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), { message: "Invalid image file type" })
    //     .refine((file) => file.size <= MAX_FILE_SIZE, {
    //         message: `Image size must not exceede ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
    //     }),
    gstin: z.string().min(1, "GSTIN is required").length(15, "Invalid GSTIN"),
    country: z.string().min(1, "Country is required"),
    addressLine1: z.string().min(1, "Street is required"),
    addressLine2: z.string().min(1, "Street is required").optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required").length(6, "Pincode is required"),
});

export const EmployeeRegSchema = z.object({
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
});

export const DoctorRegSchema = z.object({
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
    //TODO: Replace this with a Enum
    specialisation: z.string().min(1, "Specialisation is required"),
    mciNumber: z.string().min(1, "MCI Registration Number is required"),
});

export const CreateAppointmentSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().date(),
    gender: z.custom<Genders>(),
    contactNumber: z
        .string()
        .min(1, "Contact number is required")
        .length(13, "Invalid contact number")
        .startsWith("+", "Country code is required"),
    symptoms: z.string().min(1, "Symptoms is required"),
    doctor: z.string().min(1, "Doctor is required"),
    // followup: z.boolean({ message: "followup is required" }),
    paymentMethod: z.custom<PaymentMethod>(),
});

export const NewPasswordSchema = z.object({
    password: z
        .string()
        .min(8, {
            message: "Minimum 8 characters required",
        })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@$!%*?&)" }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

export type CreateAppointmentSchemaType = z.infer<typeof CreateAppointmentSchema>;
export type DoctorRegSchemaType = z.infer<typeof DoctorRegSchema>;
export type EmployeeRegSchemaType = z.infer<typeof EmployeeRegSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type CliniqRegSchemaType = z.infer<typeof CliniqRegSchema>;
export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
export type ResetSchemaType = z.infer<typeof ResetSchema>;

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

export enum EmployeeRegError {
    Invalid_Fields = "Invalid fields",
    Employee_Already_Exists = "Employee already exits",
    Something_Went_Wrong = "Something went wrong",
    Unauthorized = "Unauthorized",
    No_Creadentials = "No Credentials",
    Clinic_Head_Not_Found = "Clinic-Head not found",
}

export enum DoctorRegError {
    Invalid_Fields = "Invalid fields",
    Employee_Already_Exists = "Employee already exits",
    Something_Went_Wrong = "Something went wrong",
    Unauthorized = "Unauthorized",
    No_Creadentials = "No Credentials",
    Clinic_Head_Not_Found = "Clinic-Head not found",
    Clinic_Not_Found = "Clinic Not Found",
}

export enum CreateAppointmentError {
    Invalid_Fields = "Invalid fields",
    Something_Went_Wrong = "Something went wrong",
    Unauthorized = "Unauthorized",
    No_Creadentials = "No Credentials",
    Doctor_Not_Found = "Doctor not found",
    Clinic_Not_Found = "Clinic Not Found",
}

export enum StartSessionError {
    Something_Went_Wrong = "Something went wrong",
    Unauthorized = "Unauthorized",
    No_Creadentials = "No Credentials",
    Doctor_Not_Found = "Doctor not found",
    Clinic_Not_Found = "Clinic Not Found",
    Session_Not_Found = "Session Not Found",
}

export enum EndAppointmentError {
    Something_Went_Wrong = "Something went wrong",
    Unauthorized = "Unauthorized",
    No_Creadentials = "No Credentials",
    Doctor_Not_Found = "Doctor not found",
    Clinic_Not_Found = "Clinic Not Found",
    Session_Not_Found = "Session Not Found",
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

export type Doctor = {
    id: string;
    doctorName: string;
    timing: string;
    doctorEmail: string;
};

export type Employee = {
    id: string;
    name: string;
    email: string;
};

export type Appointment = {
    id: string;
    number: number;
    name: string;
    doctorName: string;
    status: Status;
};

export type DoctorAppointmentData = {
    id: string;
    number: number;
    patientName: string;
    gender: Genders;
    folloup: boolean;
    age: number;
    symtoms: string;
};

export type AvailableDoctorTable = { doctorId: string; doctorName: string; ongoingNumber: number; total: number };

export type AllClinicTable = { id: string; name: string; timing: string };
