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
    date: string;
    status: Status;
};

export type modifiedReshipi = Pick<Reshipi, "id" | "reshipiNumber">;

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
        const reshipiNumber = this.lastReshipiNumber + 1;

        const completedReshipi = {
            ...reshipi,
            reshipiNumber: reshipiNumber,
            status: Status.Created,
            date: new Date().toLocaleString(),
        };
        this.reshipies.push(completedReshipi);
        this.lastReshipiNumber = reshipiNumber;
        return reshipiNumber;
    }

    public removeReshipi(id: string): { modifiedReshipies: modifiedReshipi[] | null; removedReshipi: Reshipi | null } {
        if (this.reshipies.length === 0) {
            console.log("No Reshipies");
            return { modifiedReshipies: null, removedReshipi: null };
        }

        let removedIndex = null;
        let removedReshipi: Reshipi | null = null;

        this.reshipies = this.reshipies.filter((r, i) => {
            if (r.id === id) {
                removedReshipi = r;
                removedReshipi.status = Status.Canceled;
                removedIndex = i;
                return false;
            } else {
                return true;
            }
        });

        const modifiedReshipies: modifiedReshipi[] = [];

        if (removedIndex) {
            for (let i = removedIndex; i < this.reshipies.length; i++) {
                this.reshipies[i].reshipiNumber--;
                modifiedReshipies.push({
                    id: this.reshipies[i].id,
                    reshipiNumber: this.reshipies[i].reshipiNumber,
                });
            }

            this.lastReshipiNumber--;
        }

        return { modifiedReshipies, removedReshipi };
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
