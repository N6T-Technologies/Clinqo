import { Genders, PaymentMethod } from "@repo/db/src/index";

export enum Status {
    Ongoing = "Ongoing",
    Created = "Created",
    Canceled = "Canceled",
    Completed = "Completed",
    Paused = "Paused",
}

export type Reshipi = {
    id: string;
    reshipiNumber: number;
    patientFirstName: string;
    patientLastName: string;
    patientDateOfBirth: Date;
    gender: Genders;
    phoneNumber: string;
    doctorName: string;
    symptoms: string;
    followup: boolean;
    paymentMethod: PaymentMethod;
    managerId: string;
    date: string;
    status: Status;
};
