import { Reshipi, Status } from "../types/reshipiTypes";

export enum Errors {
    "NOT_FOUND" = 404,
    "BAD_REQUEST" = 400,
    "FORBIDDEN" = 403,
}

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
        currentReshipiNumber: number,
        currentReshipi: Reshipi | null,
        reshipiToStart: number
    ) {
        this.reshipies = reshipies;
        this.lastReshipiNumber = lastReshipiNumber || 0;
        this.currentReshipiNumber = currentReshipiNumber || 0;
        this.reshipiToStart = reshipiToStart || 1;
        this.currentReshipi = currentReshipi || null;
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
        return { newReshipi: completedReshipi, allReshipies: this.reshipies };
    }

    public removeReshipi(id: string): {
        depth: Reshipi[];
        modifiedReshipies: Reshipi[] | null;
        removedReshipi: Reshipi | null;
        lastReshipiNumber: number;
        error: Errors | null;
    } {
        if (this.reshipies.length === 0) {
            return {
                depth: this.reshipies,
                modifiedReshipies: null,
                removedReshipi: null,
                lastReshipiNumber: this.lastReshipiNumber,
                error: Errors.FORBIDDEN,
            };
        }

        if (this.currentReshipi && this.currentReshipi.id === id) {
            return {
                depth: this.reshipies,
                modifiedReshipies: null,
                removedReshipi: null,
                lastReshipiNumber: this.lastReshipiNumber,
                error: Errors.BAD_REQUEST,
            };
        }

        const reshipiToBeRemoved = this.reshipies.find((r) => r.id === id);

        if (!reshipiToBeRemoved) {
            return {
                depth: this.reshipies,
                modifiedReshipies: null,
                removedReshipi: null,
                lastReshipiNumber: this.lastReshipiNumber,
                error: Errors.NOT_FOUND,
            };
        }

        const removedIndex = this.reshipies.findIndex((r) => r.id === reshipiToBeRemoved.id);

        this.reshipies = this.reshipies.filter((r) => r.id != reshipiToBeRemoved.id);

        const modifiedReshipies: Reshipi[] = [];

        this.reshipies = this.reshipies.map((r, i) => {
            if (i >= removedIndex) {
                r.reshipiNumber = r.reshipiNumber - 1;
                modifiedReshipies.push(r);
                return r;
            } else {
                return r;
            }
        });

        this.lastReshipiNumber--;

        return {
            depth: this.reshipies,
            modifiedReshipies: modifiedReshipies,
            removedReshipi: reshipiToBeRemoved,
            lastReshipiNumber: this.lastReshipiNumber,
            error: null,
        };
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
        modifiedReshipies: Reshipi[] | null;
        success: boolean;
        error: Errors | null;
    } {
        if (!this.currentReshipi) {
            return {
                completedReshipi: null,
                currentReshipiNumber: this.reshipiToStart,
                modifiedReshipies: null,
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

        this.reshipies = this.reshipies.filter((r) => r.id != currentReshipi.id);

        return {
            completedReshipi: currentReshipi,
            currentReshipiNumber: this.reshipiToStart,
            modifiedReshipies: this.reshipies,
            success: true,
            error: null,
        };
    }

    public getDepth() {
        const allReshipies: { reshipiNumber: number; reshipiInfo: Omit<Reshipi, "reshipiNumber"> }[] = [];

        this.reshipies.forEach((r) => {
            allReshipies.push({
                reshipiNumber: r.reshipiNumber,
                reshipiInfo: {
                    id: r.id,
                    patientFirstName: r.patientFirstName,
                    patientLastName: r.patientLastName,
                    patientDateOfBirth: r.patientDateOfBirth,
                    gender: r.gender,
                    paymentMethod: r.paymentMethod,
                    symptoms: r.symptoms,
                    phoneNumber: r.phoneNumber,
                    followup: r.followup,
                    managerId: r.managerId,
                    date: r.date,
                    status: r.status,
                },
            });
        });

        return allReshipies;
    }

    public getCurrentReshipi() {
        return this.currentReshipi;
    }

    public getNumberOfReshipies() {
        return this.reshipies.length;
    }

    public getSnapshot() {
        return {
            clinic: this.clinic,
            doctor: this.doctor,
            reshipies: this.reshipies,
            lastReshipiNumber: this.lastReshipiNumber,
            currentReshipiNumber: this.currentReshipiNumber,
            currentReshipi: this.currentReshipi,
            reshipiToStart: this.reshipiToStart,
        };
    }
}
