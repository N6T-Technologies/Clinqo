import fs from "fs";
import { Errors, Reshipi, ReshipiBook } from "./ReshipiBook";
import {
    CANCEL_RESHIPI,
    CREATE_RESHIPI,
    END_RESHIPI,
    END_RESHIPI_BOOK,
    GET_DEPTH,
    MessageFromApi,
    START_RESHIPI,
    START_RESHIPI_BOOK,
} from "../types/fromApi";
import { RedisManager } from "../RedisManager";
import {
    ONGOING_RESHIPI,
    RESHIPI_BOOK_ENDED,
    RESHIPI_BOOK_STARTED,
    RESHIPI_CANCELLED,
    RESHIPI_CREATED,
    RESHIPI_ENDED,
    RESHIPI_STARTED,
    RETRY_CANCEL_RESHIPI,
    RETRY_CREATE_RESHIPI,
    RETRY_END_RESHIPI,
    RETRY_END_RESHIPI_BOOK,
    RETRY_RESHIPI_BOOK_START,
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
            //TODO: replace any with appropriate type
            const snapshotObject = JSON.parse(snapshot.toString());
            this.reshipieBooks = snapshotObject.reshipieBooks.map(
                (r: any) =>
                    new ReshipiBook(
                        r.clinic,
                        r.doctor,
                        r.reshipies,
                        r.lastReshipiNumber,
                        r.currentReshipiNumber,
                        r.currentReshipi,
                        r.reshipiToStart
                    )
            );
        } else {
            this.reshipieBooks = [new ReshipiBook("Apollo", "Rakshas", [], 0, 0, null, 1)];
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
                    const { newReshipi, allReshipies, success, error } = this.createReshipi(
                        message.data.clinic_doctor,
                        message.data.patientFirstName,
                        message.data.patientLastName,
                        message.data.patientAge,
                        message.data.symptoms,
                        message.data.phoneNumber,
                        message.data.followup,
                        message.data.managerId
                    );

                    if (error) {
                        throw Error(`Reshipi Book wih title ${message.data.clinic_doctor} not found`);
                    }

                    if (newReshipi && allReshipies) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: RESHIPI_CREATED,
                            payload: {
                                newReshipi: newReshipi,
                                ok: true,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(`new@${message.data.clinic_doctor}`, {
                            stream: `new@${message.data.clinic_doctor}`,
                            data: {
                                depth: allReshipies,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(`total@${message.data.clinic_doctor}`, {
                            stream: `total@${message.data.clinic_doctor}`,
                            data: {
                                totalNumber: allReshipies.length,
                            },
                        });
                    }
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_CREATE_RESHIPI,
                        payload: {
                            ok: false,
                            //@ts-ignore
                            msg: e?.message,
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
                        const { depth, modifiedReshipies, removedReshipi, lastReshipiNumber, error } =
                            currentReshipieBook.removeReshipi(id);

                        if (error === Errors.FORBIDDEN) {
                            throw Error("No Reshipies found!");
                        } else if (error === Errors.BAD_REQUEST) {
                            throw Error(`Reshipi with id ${id} is already started so it cannot be Cancelled`);
                        } else if (error === Errors.NOT_FOUND) {
                            throw Error(`Reshipi with id ${id} does not exist`);
                        }

                        if (removedReshipi && modifiedReshipies) {
                            //TODO: publish to db service as well as WS server
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RESHIPI_CANCELLED,
                                payload: {
                                    reshipiId: removedReshipi.id,
                                    reshipiNumber: removedReshipi.reshipiNumber,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(`depth@${clinic_doctor}`, {
                                stream: `depth@${clinic_doctor}`,
                                data: {
                                    reshipies: depth,
                                    cancelledReshipi: removedReshipi,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(`total@${clinic_doctor}`, {
                                stream: `total@${clinic_doctor}`,
                                data: {
                                    totalNumber: lastReshipiNumber,
                                },
                            });

                            modifiedReshipies.forEach((r) => {
                                RedisManager.getInstance().publishMessageToWs(`number@${r.id}`, {
                                    stream: `number@${r.id}`,
                                    data: {
                                        newNumber: r.reshipiNumber,
                                    },
                                });
                            });
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
                            reshipiNumber: null,
                            //@ts-ignore
                            msg: e?.message,
                        },
                    });
                }
                break;

            case START_RESHIPI:
                try {
                    const clinic_doctor = message.data.clinic_doctor;

                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

                    if (currentReshipieBook) {
                        const { currentReshipi, currentReshipiNumber, error } = currentReshipieBook.startReshipi();

                        if (currentReshipi && error === Errors.FORBIDDEN) {
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: ONGOING_RESHIPI,
                                payload: {
                                    reshipiId: currentReshipi.id,
                                    msg: `Reshipi with id ${currentReshipi.id} is already ongoing`,
                                },
                            });
                        } else if (currentReshipi && !error) {
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RESHIPI_STARTED,
                                payload: {
                                    reshipiId: currentReshipi.id,
                                    currentReshipiNumber: currentReshipiNumber,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(`ongoing@${clinic_doctor}`, {
                                stream: `ongoing@${clinic_doctor}`,
                                data: {
                                    number: currentReshipi.reshipiNumber,
                                },
                            });
                        } else {
                            throw Error(`No Reshipies`);
                        }
                    } else {
                        throw Error(`Reshipi book with clinic_doctor ${clinic_doctor} not found`);
                    }
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_START_RESHIPI,
                        payload: {
                            reshipiId: "",
                            currentReshipiNumber: null,
                            //@ts-ignore
                            msg: e?.message,
                        },
                    });
                }
                break;
            case END_RESHIPI:
                try {
                    const clinic_doctor = message.data.clinic_doctor;

                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

                    if (currentReshipieBook) {
                        const { completedReshipi, modifiedReshipies, currentReshipiNumber, success, error } =
                            currentReshipieBook.endReshipi();

                        if (success && completedReshipi) {
                            //TODO: Send completedReshipi to DB Processor service
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RESHIPI_ENDED,
                                payload: {
                                    reshipiId: completedReshipi.id,
                                    currentReshipiNumber: currentReshipiNumber,
                                },
                            });
                        } else if (error) {
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RETRY_END_RESHIPI,
                                payload: {
                                    reshipiId: "",
                                    msg: "You have to start reshipi before trying to end one",
                                },
                            });
                        }
                    } else {
                        throw Error(`Reshipi book with clinic_doctor ${clinic_doctor} not found`);
                    }
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_END_RESHIPI,
                        payload: {
                            reshipiId: "",
                            //@ts-ignore
                            msg: e?.message,
                        },
                    });
                }
                break;
            case GET_DEPTH:
                try {
                    const clinic_doctor = message.data.clinic_doctor;
                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

                    if (!currentReshipieBook) {
                        throw Error(`Reshipi book with title ${clinic_doctor} does not exist`);
                    }

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: {
                            reshipies: currentReshipieBook.getDepth(),
                        },
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "RETRY_DEPTH",
                        payload: {
                            reshipies: null,
                            //@ts-ignore
                            msg: e?.message,
                        },
                    });
                }
                break;

            case START_RESHIPI_BOOK:
                try {
                    const clinic_doctor = message.data.clinic_doctor;
                    const clinic = clinic_doctor.split("_")[0];
                    const doctor = clinic_doctor.split("_")[1];

                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);
                    if (currentReshipieBook) {
                        throw Error(`Reshipi book with title ${clinic_doctor} already exist`);
                    }

                    const newReshipiBook = new ReshipiBook(clinic, doctor, [], 0, 0, null, 1);
                    this.reshipieBooks.push(newReshipiBook);

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RESHIPI_BOOK_STARTED,
                        payload: {
                            ok: true,
                            msg: `Reshipi book with title ${newReshipiBook.title()} started`,
                        },
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_RESHIPI_BOOK_START,
                        payload: {
                            ok: false,
                            error: Errors.BAD_REQUEST,
                            //@ts-ignore
                            msg: e.message,
                        },
                    });
                }
                break;
            case END_RESHIPI_BOOK:
                try {
                    const clinic_doctor = message.data.clinic_doctor;

                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

                    if (!currentReshipieBook) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: RETRY_END_RESHIPI_BOOK,
                            payload: {
                                ok: false,
                                error: Errors.NOT_FOUND,
                                msg: `Reshipi book with title ${clinic_doctor} does not exist`,
                            },
                        });
                        return;
                    }

                    const currentReshipi = currentReshipieBook.getCurrentReshipi();
                    const numberOfReshipes = currentReshipieBook.getNumberOfReshipies();

                    if (currentReshipi) {
                        throw Error(`End current Reshipi with id ${currentReshipi.id} before ending the book`);
                    } else if (numberOfReshipes > 0) {
                        throw Error(
                            `There are still remaining reshipies in the book with title ${clinic_doctor} either remove them or try to end forcefully`
                        );
                    }

                    if (!currentReshipi && numberOfReshipes === 0) {
                        this.reshipieBooks = this.reshipieBooks.filter((r) => r.title() != clinic_doctor);

                        RedisManager.getInstance().sendToApi(clientId, {
                            type: RESHIPI_BOOK_ENDED,
                            payload: {
                                ok: true,
                                msg: `Reshipi book with title ${clinic_doctor} ended`,
                            },
                        });
                    }
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_END_RESHIPI_BOOK,
                        payload: {
                            ok: false,
                            error: Errors.BAD_REQUEST,
                            //@ts-ignore
                            msg: e?.message,
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
    ): { newReshipi: Reshipi | null; allReshipies: Reshipi[] | null; success?: boolean; error?: Errors } {
        const ReshipiBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

        if (!ReshipiBook) {
            return { newReshipi: null, allReshipies: null, error: Errors.NOT_FOUND };
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

        const { newReshipi, allReshipies } = ReshipiBook.addReshipi(reshipi);

        return { newReshipi: newReshipi, allReshipies: allReshipies, success: true };
    }

    private getRandomId() {
        let S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }
}
