enum Status {
    "Created",
    "Ongoing",
    "Completed",
    "Canceled",
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
    date: Date;
    status: Status;
};

export class ReshipiBook {
    private reshipies: Reshipi[];
    private lastReshipiNumber: number;
    private currentReshipiNumber: number;
    private doctor: string;
    private clinic: string;

    public constructor(
        clinic: string,
        doctor: string,
        reshipies: Reshipi[],
        lastReshipiNumber: number,
        currentReshipiNumber: number
    ) {
        this.reshipies = reshipies;
        this.lastReshipiNumber = lastReshipiNumber || 0;
        this.currentReshipiNumber = currentReshipiNumber || 0;
        this.doctor = doctor;
        this.clinic = clinic;
    }

    public title(): string {
        return `${this.clinic}_${this.doctor}`;
    }

    public addReshipi(reshipi: Omit<Reshipi, "reshipiNumber" | "status" | "date">) {
        const completedReshipi = {
            ...reshipi,
            reshipiNumber: this.reshipies.length + 1,
            status: Status.Created,
            date: new Date(),
        };
        this.reshipies.push(completedReshipi);
        return this.reshipies.length + 1;
    }

    public getSnapshot() {
        return {
            clinic: this.clinic,
            doctor: this.doctor,
            reshipies: this.reshipies,
            lastReshipiNumber: this.lastReshipiNumber,
            currentReshipiNumber: this.currentReshipiNumber,
        };
    }
}
