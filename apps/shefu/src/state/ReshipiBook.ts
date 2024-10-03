enum Status {
    "Created",
    "Ongoing",
    "Completed",
    "Canceled",
}

export enum Errors {
    "NOT_FOUND" = 404,
    "BAD_REQUEST" = 400,
    "FORBIDDEN" = 403,
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
    private currentReshipi: Reshipi | null;
    private reshipiToStart: number;
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
        this.reshipiToStart = 1;
        this.currentReshipi = null;
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

    public startReshipi(): {
        currentReshipi: Reshipi | null;
        currentReshipiNumber: number;
        error: Errors | null;
    } {
        if (this.reshipies.length === 0) {
            return { currentReshipi: null, currentReshipiNumber: this.currentReshipiNumber, error: Errors.NOT_FOUND };
        }

        if (this.currentReshipi) {
            return {
                currentReshipi: this.currentReshipi,
                currentReshipiNumber: this.currentReshipiNumber,
                error: Errors.FORBIDDEN,
            };
        }

        const currentReshipi = this.reshipies.find((r) => r.reshipiNumber === this.reshipiToStart);

        if (currentReshipi) {
            currentReshipi.status = Status.Ongoing;
            this.reshipies = this.reshipies.map((r) => {
                if (r.id === currentReshipi.id) {
                    r = currentReshipi;
                    return r;
                } else {
                    return r;
                }
            });
            this.currentReshipiNumber = currentReshipi.reshipiNumber;
            this.currentReshipi = currentReshipi;
            this.reshipiToStart++;

            return { currentReshipi, currentReshipiNumber: this.currentReshipiNumber, error: null };
        } else {
            return { currentReshipi: null, currentReshipiNumber: this.reshipiToStart, error: Errors.NOT_FOUND };
        }
    }

    public endReshipi(): {
        completedReshipi: Reshipi | null;
        currentReshipiNumber: number | null;
        success: boolean;
        error: Errors | null;
    } {
        if (!this.currentReshipi) {
            return {
                completedReshipi: null,
                currentReshipiNumber: this.reshipiToStart,
                success: false,
                error: Errors.BAD_REQUEST,
            };
        }

        this.currentReshipi.status = Status.Completed;
        this.reshipies = this.reshipies.map((r) => {
            if (this.currentReshipi && r.id === this.currentReshipi.id) {
                r = this.currentReshipi;
                return r;
            } else {
                return r;
            }
        });

        const currentReshipi = this.currentReshipi;

        this.currentReshipi = null;
        console.log(this.reshipies);
        console.log(this.currentReshipi);

        return {
            completedReshipi: currentReshipi,
            currentReshipiNumber: this.reshipiToStart,
            success: true,
            error: null,
        };
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
