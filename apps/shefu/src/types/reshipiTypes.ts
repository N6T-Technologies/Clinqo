export enum Status {
    Ongoing = "Ongoing",
    Created = "Created",
    Canceled = "Canceled",
    Completed = "Completed",
}

export type Reshipi = {
    id: string;
    reshipiNumber: number;
    patientFirstName: string;
    patientLastName: string;
    patientAge: string;
    symptoms: string;
    phoneNumber: string;
    followup: boolean;
    managerId: string;
    date: string;
    status: Status;
};
