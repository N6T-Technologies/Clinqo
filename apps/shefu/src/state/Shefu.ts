import fs from "fs";
import { Reshipi, ReshipiBook } from "./ReshipiBook";
import { CANCEL_RESHIPI, CREATE_RESHIPI, MessageFromApi, START_RESHIPI } from "../types/fromApi";
import { RedisManager } from "../RedisManager";
import {
    ONGOING_RESHIPI,
    RESHIPI_CANCELLED,
    RESHIPI_CREATED,
    RESHIPI_STARTED,
    RETRY_CANCEL_RESHIPI,
    RETRY_CREATE_RESHIPI,
    RETRY_START_RESHIPI,
} from "../types/toApi";

export class Shefu {
    private static instance: Shefu;

    private reshipieBooks: ReshipiBook[] = [];

    private constructor() {
        let snapshot = null;

        try {
            if (process.env.WITH_SNAPSHOT) {
                snapshot = fs.readFileSync("./snapshot.json");
            }
        } catch (e) {
            console.log("No snapshot found");
        }

        if (snapshot) {
            const snapshotObject = JSON.parse(snapshot.toString());
            this.reshipieBooks = snapshotObject.reshipieBooks.map(
                (r: any) =>
                    new ReshipiBook(r.clinic, r.doctor, r.reshipies, r.lastReshipiNumber, r.currentReshipiNumber)
            );
        } else {
            this.reshipieBooks = [new ReshipiBook("Apollo", "Rakshas", [], 0, 0)];
        }

        setInterval(() => {
            this.saveSnapshot();
        }, 1000 * 3);
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Shefu();
        }

        return this.instance;
    }

    private saveSnapshot() {
        const snapshotObject = {
            reshipieBooks: this.reshipieBooks.map((r) => r.getSnapshot()),
        };

        fs.writeFileSync("./snapshot.json", JSON.stringify(snapshotObject));
    }

    public process({ message, clientId }: { message: MessageFromApi; clientId: string }) {
        switch (message.type) {
            case CREATE_RESHIPI:
                try {
                    const { reshipiId, reshipiNumber } = this.createReshipi(
                        message.data.clinic_doctor,
                        message.data.patientFirstName,
                        message.data.patientLastName,
                        message.data.patientAge,
                        message.data.symptoms,
                        message.data.phoneNumber,
                        message.data.followup,
                        message.data.managerId
                    );

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RESHIPI_CREATED,
                        payload: {
                            reshipiId,
                            reshipiNumber,
                        },
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_CREATE_RESHIPI,
                        payload: {
                            reshipiId: "",
                            reshipiNumber: 0,
                        },
                    });
                }
                break;
            case CANCEL_RESHIPI:
                try {
                    const clinic_doctor = message.data.clinic_doctor;
                    const id = message.data.id;

                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

                    if (currentReshipieBook) {
                        const { modifiedReshipies, removedReshipi } = currentReshipieBook.removeReshipi(id);

                        if (removedReshipi) {
                            //TODO: publish to db service as well as WS server
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RESHIPI_CANCELLED,
                                payload: {
                                    reshipiId: removedReshipi.id,
                                    reshipiNumber: removedReshipi.reshipiNumber,
                                },
                            });
                        } else {
                            throw Error(`Reshipi with id ${id} not found`);
                        }
                    } else {
                        throw Error(`Reshipi book with clinic_doctor ${clinic_doctor} not found`);
                    }
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_CANCEL_RESHIPI,
                        payload: {
                            reshipiId: message.data.id,
                            reshipiNumber: 0,
                        },
                    });
                }
                break;

            case START_RESHIPI:
                try {
                    const clinic_doctor = message.data.clinic_doctor;
                    const id = message.data.id;

                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

                    if (currentReshipieBook) {
                        const { currentReshipi, currentReshipiNumber } = currentReshipieBook.startReshipi(id);

                        if (currentReshipi && currentReshipi.id != id) {
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: ONGOING_RESHIPI,
                                payload: {
                                    reshipiId: currentReshipi.id,
                                    msg: `Reshipi with id ${currentReshipi.id} is already ongoing`,
                                },
                            });
                        } else if (currentReshipi && currentReshipi.id === id) {
                            console.log(currentReshipiNumber);
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RESHIPI_STARTED,
                                payload: {
                                    reshipiId: currentReshipi.id,
                                    currentReshipiNumber: currentReshipiNumber,
                                },
                            });
                        } else {
                            throw Error(`Reshipi with id ${id} not found`);
                        }
                    } else {
                        throw Error(`Reshipi book with clinic_doctor ${clinic_doctor} not found`);
                    }
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_START_RESHIPI,
                        payload: {
                            reshipiId: message.data.id,
                            reshipiNumber: 0,
                        },
                    });
                }
                break;
        }
    }

    private createReshipi(
        clinic_doctor: string,

        patientFirstName: string,
        patientLastName: string,
        patientAge: string,
        symptoms: string,
        phoneNumber: string,

        followup: boolean,
        managerId: string
    ): { reshipiId: string; reshipiNumber: number } {
        const ReshipiBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

        if (!ReshipiBook) {
            throw new Error("No Reshipi Book found");
        }

        type reshipiType = Omit<Reshipi, "reshipiNumber" | "status" | "date">;

        const reshipiId = this.getRandomId();

        const reshipi: reshipiType = {
            id: reshipiId,
            patientFirstName: patientFirstName,
            patientLastName: patientLastName,
            patientAge: patientAge,
            symptoms: symptoms,
            phoneNumber: phoneNumber,
            followup: followup,
            managerId: managerId,
        };

        const reshipiNumber = ReshipiBook.addReshipi(reshipi);

        return { reshipiId: reshipiId, reshipiNumber: reshipiNumber };
    }

    private getRandomId() {
        let S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }
}
