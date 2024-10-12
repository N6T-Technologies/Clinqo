import fs from "fs";
import { Errors, ReshipiBook, ReshipiBookSnapshot } from "./ReshipiBook";
import { Reshipi, Status } from "../types/reshipiTypes";
import {
    CANCEL_RESHIPI,
    CREATE_RESHIPI,
    END_RESHIPI,
    END_RESHIPI_BOOK,
    GET_AVAILABLE_DOCTORS,
    GET_DEPTH_CLINIC,
    GET_DEPTH_DOCTOR,
    MessageFromApi,
    PAUSE_RESHIPI_BOOK,
    START_RESHIPI,
    START_RESHIPI_BOOK,
} from "../types/fromApi";
import { RedisManager } from "../RedisManager";
import {
    ONGOING_RESHIPI,
    RESHIPI_BOOK_ENDED,
    RESHIPI_BOOK_PAUSED,
    RESHIPI_BOOK_STARTED,
    RESHIPI_CANCELLED,
    RESHIPI_CREATED,
    RESHIPI_ENDED,
    RESHIPI_STARTED,
    RETRY_CANCEL_RESHIPI,
    RETRY_CREATE_RESHIPI,
    RETRY_END_RESHIPI,
    RETRY_END_RESHIPI_BOOK,
    RETRY_PAUSE_RESHIPI_BOOK,
    RETRY_RESHIPI_BOOK_START,
    RETRY_START_RESHIPI,
} from "../types/toApi";
import { Genders, PaymentMethod } from "@repo/db/src";

export type AvailableDoctor = { doctor: string; doctorName: string; clinic: string };

export class Shefu {
    private static instance: Shefu;

    private reshipieBooks: ReshipiBook[] = [];
    private availableDoctors: AvailableDoctor[] = [];
    private pausedReshipiBooks: Record<string, ReshipiBookSnapshot> = {};
    //TODO: Implement this along with a timeout function
    // private cancelledReshipies: Record<string, Reshipi[]> = {};
    // private completedReshipies: Record<string, Reshipi[]> = {};

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
                        r.reshipiToStart,
                        r.doctorName
                    )
            );
            this.availableDoctors = snapshotObject.availableDoctors;
            this.pausedReshipiBooks = snapshotObject.pausedReshipiBooks;
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
            availableDoctors: this.availableDoctors,
            pausedReshipiBooks: this.pausedReshipiBooks,
        };

        fs.writeFileSync("./snapshot.json", JSON.stringify(snapshotObject));
    }

    public process({ message, clientId }: { message: MessageFromApi; clientId: string }) {
        switch (message.type) {
            case CREATE_RESHIPI:
                try {
                    const { newReshipi, allReshipies, error } = this.createReshipi(
                        message.data.clinic_doctor,
                        message.data.patientFirstName,
                        message.data.patientLastName,
                        message.data.patientDateOfBirth,
                        message.data.gender,
                        message.data.doctorName,
                        message.data.symptoms,
                        message.data.phoneNumber,
                        message.data.paymentMethod,
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
                                depth: allReshipies,
                                ok: true,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(`new_doctor@${message.data.clinic_doctor}`, {
                            stream: `new_doctor@${message.data.clinic_doctor}`,
                            data: {
                                reshipi: newReshipi,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(
                            `new_clinic@${message.data.clinic_doctor.split("_")[0]}`,
                            {
                                stream: `new_clinic@${message.data.clinic_doctor.split("_")[0]}`,
                                data: {
                                    reshipi: newReshipi,
                                },
                            }
                        );

                        RedisManager.getInstance().publishMessageToWs(`depth@${message.data.clinic_doctor}`, {
                            stream: `depth@${message.data.clinic_doctor}`,
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
                        const { modifiedReshipies, removedReshipi, lastReshipiNumber, error } =
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
                                    ok: true,
                                    id: removedReshipi.id,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(`cancellation_doctor@${clinic_doctor}`, {
                                stream: `cancellation_doctor@${clinic_doctor}`,
                                data: {
                                    reshipies: modifiedReshipies,
                                    removedReshipi: removedReshipi,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(
                                `cancellation_clinic@${clinic_doctor.split("_")[0]}`,
                                {
                                    stream: `cancellation_clinic@${clinic_doctor.split("_")[0]}`,
                                    data: {
                                        reshipies: modifiedReshipies,
                                        removedReshipi: removedReshipi,
                                    },
                                }
                            );

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
                            ok: false,
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
                        const { currentReshipi, error } = currentReshipieBook.startReshipi();

                        if (currentReshipi && error === Errors.FORBIDDEN) {
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: ONGOING_RESHIPI,
                                payload: {
                                    ok: false,
                                    reshipiId: currentReshipi.id,
                                    msg: `Reshipi with id ${currentReshipi.id} is already ongoing`,
                                },
                            });
                        } else if (currentReshipi && !error) {
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RESHIPI_STARTED,
                                payload: {
                                    ok: true,
                                    reshipiId: currentReshipi.id,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(`current@${clinic_doctor}`, {
                                stream: `current@${clinic_doctor}`,
                                data: {
                                    currentNumber: currentReshipi.reshipiNumber,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(`ongoing_doctor@${clinic_doctor}`, {
                                stream: `ongoing_doctor@${clinic_doctor}`,
                                data: {
                                    reshipi: currentReshipi,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(
                                `ongoing_clinic@${clinic_doctor.split("_")[0]}`,
                                {
                                    stream: `ongoing_clinic@${clinic_doctor.split("_")[0]}`,
                                    data: {
                                        reshipi: currentReshipi,
                                    },
                                }
                            );
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
                            ok: false,
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
                        const { completedReshipi, currentReshipiNumber, success, error } =
                            currentReshipieBook.endReshipi();

                        if (success && completedReshipi) {
                            //TODO: Send completedReshipi to DB Processor service
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RESHIPI_ENDED,
                                payload: {
                                    ok: true,
                                    reshipiId: completedReshipi.id,
                                    currentReshipiNumber: currentReshipiNumber,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(`completed_doctor@${clinic_doctor}`, {
                                stream: `completed_doctor@${clinic_doctor}`,
                                data: {
                                    reshipi: completedReshipi,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(
                                `completed_clinic@${clinic_doctor.split("_")[0]}`,
                                {
                                    stream: `completed_clinic@${clinic_doctor.split("_")[0]}`,
                                    data: {
                                        reshipi: completedReshipi,
                                    },
                                }
                            );
                        } else if (error) {
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: RETRY_END_RESHIPI,
                                payload: {
                                    ok: false,
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
                            ok: false,
                            //@ts-ignore
                            msg: e?.message,
                        },
                    });
                }
                break;
            case GET_DEPTH_DOCTOR:
                try {
                    const clinic_doctor = message.data.clinic_doctor;
                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

                    if (!currentReshipieBook) {
                        throw Error(`Reshipi book with title ${clinic_doctor} does not exist`);
                    }

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH_DOCTOR",
                        payload: {
                            ok: true,
                            reshipies: currentReshipieBook.getDepth(),
                        },
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "RETRY_DEPTH_DOCTOR",
                        payload: {
                            ok: false,
                            reshipies: null,
                            //@ts-ignore
                            msg: e?.message,
                        },
                    });
                }
                break;

            case GET_DEPTH_CLINIC:
                try {
                    const clinic = message.data.clinic;

                    const clinicReshipiBooks = this.reshipieBooks.filter((r) => {
                        const clinicId = r.title().split("_")[0];
                        if (clinicId === clinic) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    type ReturnType = {
                        doctorName: string;
                        reshipies: {
                            reshipiNumber: number;
                            reshipiInfo: Omit<Reshipi, "reshipiNumber" | "doctorName">;
                        }[];
                    };

                    const data: ReturnType[] = [];

                    clinicReshipiBooks.forEach((rb) => {
                        const doctorName = rb.getDoctorName();
                        const doctorReshipi = {
                            doctorName: doctorName,
                            reshipies: rb.getDepth(),
                        };

                        data.push(doctorReshipi);
                    });

                    const pausedReshipiBooks = this.getValuesWithWildcard<ReshipiBookSnapshot>(
                        this.pausedReshipiBooks,
                        clinic + "*"
                    );

                    pausedReshipiBooks.forEach((prb) => {
                        const doctorName = prb.doctorName;
                        const doctorReshipi: ReturnType = {
                            doctorName: doctorName,
                            reshipies: prb.reshipies.map((r) => {
                                return {
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
                                };
                            }),
                        };

                        data.push(doctorReshipi);
                    });

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH_CLINIC",
                        payload: {
                            ok: true,
                            doctorReshipies: data,
                        },
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "RETRY_DEPTH_CLINIC",
                        payload: {
                            doctorReshipies: null,
                            ok: false,
                            //@ts-ignore
                            msg: e?.message,
                        },
                    });
                }
                break;

            case GET_AVAILABLE_DOCTORS:
                try {
                    const clinic = message.data.clinic;

                    const availableDoctorsWithCurrentAndTotal: {
                        doctorId: string;
                        doctorName: string;
                        ongoingNumber: number;
                        total: number;
                    }[] = [];

                    this.availableDoctors.forEach((ad) => {
                        if (ad.clinic === clinic) {
                            const rb = this.reshipieBooks.find((rb) => rb.title() === `${ad.clinic}_${ad.doctor}`);

                            if (!rb) {
                                availableDoctorsWithCurrentAndTotal.push({
                                    doctorId: ad.doctor,
                                    doctorName: ad.doctorName,
                                    ongoingNumber: 0,
                                    total: 0,
                                });
                            } else {
                                availableDoctorsWithCurrentAndTotal.push({
                                    doctorId: ad.doctor,
                                    doctorName: ad.doctorName,
                                    ongoingNumber: rb.getCurrentReshipi()?.reshipiNumber || 0,
                                    total: rb.getNumberOfReshipies(),
                                });
                            }
                        }
                    });

                    if (!availableDoctorsWithCurrentAndTotal) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: "RETRY_AVAILABLE_DOCTORS",
                            payload: {
                                ok: false,
                                error: Errors.NOT_FOUND,
                            },
                        });
                        return;
                    }

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "AVAILABLE_DOCTORS",
                        payload: {
                            ok: true,
                            doctors: availableDoctorsWithCurrentAndTotal,
                        },
                    });
                } catch (e) {
                    console.log(e);

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "RETRY_AVAILABLE_DOCTORS",
                        payload: {
                            ok: false,
                            error: Errors.BAD_REQUEST,
                        },
                    });
                }
                break;

            case START_RESHIPI_BOOK:
                try {
                    const clinic_doctor = message.data.clinic_doctor;
                    const doctorName = message.data.doctorName;
                    const clinic = clinic_doctor.split("_")[0];
                    const doctor = clinic_doctor.split("_")[1];

                    const foundSnapshot = this.pausedReshipiBooks[clinic_doctor];

                    if (foundSnapshot) {
                        const restartedReshipiBook = new ReshipiBook(
                            foundSnapshot.clinic,
                            foundSnapshot.doctor,
                            foundSnapshot.reshipies,
                            foundSnapshot.lastReshipiNumber,
                            foundSnapshot.currentReshipiNumber,
                            foundSnapshot.currentReshipi,
                            foundSnapshot.reshipiToStart,
                            foundSnapshot.doctorName
                        );

                        delete this.pausedReshipiBooks.clinic_doctor;

                        const restartedReshipies = restartedReshipiBook.restartAll();

                        this.reshipieBooks.push(restartedReshipiBook);

                        const doctorName = restartedReshipiBook.getDoctorName();

                        this.availableDoctors.push({ doctor, doctorName, clinic });

                        const availableDoctorsWithCurrentAndTotal: {
                            doctorId: string;
                            doctorName: string;
                            ongoingNumber: number;
                            total: number;
                        }[] = [];

                        this.availableDoctors.forEach((ad) => {
                            if (ad.clinic === clinic) {
                                const rb = this.reshipieBooks.find((rb) => rb.title() === `${ad.clinic}_${ad.doctor}`);

                                if (!rb) {
                                    availableDoctorsWithCurrentAndTotal.push({
                                        doctorId: ad.doctor,
                                        doctorName: ad.doctorName,
                                        ongoingNumber: 0,
                                        total: 0,
                                    });
                                } else {
                                    availableDoctorsWithCurrentAndTotal.push({
                                        doctorId: ad.doctor,
                                        doctorName: ad.doctorName,
                                        ongoingNumber: rb.getCurrentReshipi()?.reshipiNumber || rb.getReshipiToStart(),
                                        total: rb.getNumberOfReshipies(),
                                    });
                                }
                            }
                        });

                        if (!availableDoctorsWithCurrentAndTotal) {
                            RedisManager.getInstance().sendToApi(clientId, {
                                type: "RETRY_AVAILABLE_DOCTORS",
                                payload: {
                                    ok: false,
                                    error: Errors.NOT_FOUND,
                                },
                            });

                            RedisManager.getInstance().publishMessageToWs(`doctors@${clinic}`, {
                                stream: `doctors@${clinic}`,
                                data: {
                                    doctors: availableDoctorsWithCurrentAndTotal,
                                },
                            });
                            return;
                        }

                        RedisManager.getInstance().sendToApi(clientId, {
                            type: RESHIPI_BOOK_STARTED,
                            payload: {
                                ok: true,
                                msg: `Reshipi book with title ${restartedReshipiBook.title()} started`,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(`doctors@${clinic}`, {
                            stream: `doctors@${clinic}`,
                            data: {
                                doctors: availableDoctorsWithCurrentAndTotal,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(`modified-reshipies@${clinic}`, {
                            stream: `modified-reshipies@${clinic}`,
                            data: {
                                modifiedReshipies: restartedReshipies,
                            },
                        });

                        restartedReshipies.forEach((r) => {
                            RedisManager.getInstance().publishMessageToWs(`status-update@${r.id}`, {
                                stream: `status-update@${r.id}`,
                                data: {
                                    status: Status.Created,
                                    number: r.reshipiNumber,
                                },
                            });
                        });

                        return;
                    }

                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);
                    if (currentReshipieBook) {
                        throw Error(`Reshipi book with title ${clinic_doctor} already exist`);
                    }

                    const newReshipiBook = new ReshipiBook(clinic, doctor, [], 0, 0, null, 1, doctorName);
                    this.reshipieBooks.push(newReshipiBook);
                    this.availableDoctors.push({ doctor, doctorName, clinic });

                    const availableDoctorsWithCurrentAndTotal: {
                        doctorId: string;
                        doctorName: string;
                        ongoingNumber: number;
                        total: number;
                    }[] = [];

                    this.availableDoctors.forEach((ad) => {
                        if (ad.clinic === clinic) {
                            const rb = this.reshipieBooks.find((rb) => rb.title() === `${ad.clinic}_${ad.doctor}`);

                            if (!rb) {
                                availableDoctorsWithCurrentAndTotal.push({
                                    doctorId: ad.doctor,
                                    doctorName: ad.doctorName,
                                    ongoingNumber: 0,
                                    total: 0,
                                });
                            } else {
                                availableDoctorsWithCurrentAndTotal.push({
                                    doctorId: ad.doctor,
                                    doctorName: ad.doctorName,
                                    ongoingNumber: rb.getCurrentReshipi()?.reshipiNumber || 0,
                                    total: rb.getNumberOfReshipies(),
                                });
                            }
                        }
                    });

                    if (!availableDoctorsWithCurrentAndTotal) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: "RETRY_AVAILABLE_DOCTORS",
                            payload: {
                                ok: false,
                                error: Errors.NOT_FOUND,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(`doctors@${clinic}`, {
                            stream: `doctors@${clinic}`,
                            data: {
                                doctors: availableDoctorsWithCurrentAndTotal,
                            },
                        });
                        return;
                    }

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RESHIPI_BOOK_STARTED,
                        payload: {
                            ok: true,
                            msg: `Reshipi book with title ${newReshipiBook.title()} started`,
                        },
                    });

                    RedisManager.getInstance().publishMessageToWs(`doctors@${clinic}`, {
                        stream: `doctors@${clinic}`,
                        data: {
                            doctors: availableDoctorsWithCurrentAndTotal,
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
                    const clinic = clinic_doctor.split("_")[0];

                    if (this.pausedReshipiBooks[clinic_doctor]) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: RETRY_END_RESHIPI_BOOK,
                            payload: {
                                ok: false,
                                error: Errors.BAD_REQUEST,
                                msg: `Reshipi book with title ${clinic_doctor} is paused`,
                            },
                        });
                        return;
                    }

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

                    this.reshipieBooks = this.reshipieBooks.filter((r) => r.title() != clinic_doctor);
                    this.availableDoctors = this.availableDoctors.filter((r) => {
                        if (`${r.clinic}_${r.doctor}` === clinic_doctor) {
                            return false;
                        } else {
                            return true;
                        }
                    });

                    const availableDoctorsWithCurrentAndTotal: {
                        doctorId: string;
                        doctorName: string;
                        ongoingNumber: number;
                        total: number;
                    }[] = [];

                    this.availableDoctors.forEach((ad) => {
                        if (ad.clinic === clinic) {
                            const rb = this.reshipieBooks.find((rb) => rb.title() === `${ad.clinic}_${ad.doctor}`);

                            if (!rb) {
                                availableDoctorsWithCurrentAndTotal.push({
                                    doctorId: ad.doctor,
                                    doctorName: ad.doctorName,
                                    ongoingNumber: 0,
                                    total: 0,
                                });
                            } else {
                                availableDoctorsWithCurrentAndTotal.push({
                                    doctorId: ad.doctor,
                                    doctorName: ad.doctorName,
                                    ongoingNumber: rb.getCurrentReshipi()?.reshipiNumber || 0,
                                    total: rb.getNumberOfReshipies(),
                                });
                            }
                        }
                    });

                    if (!availableDoctorsWithCurrentAndTotal) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: "RETRY_AVAILABLE_DOCTORS",
                            payload: {
                                ok: false,
                                error: Errors.NOT_FOUND,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(`doctors@${clinic}`, {
                            stream: `doctors@${clinic}`,
                            data: {
                                doctors: availableDoctorsWithCurrentAndTotal,
                            },
                        });
                        return;
                    }

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RESHIPI_BOOK_ENDED,
                        payload: {
                            ok: true,
                            msg: `Reshipi book with title ${clinic_doctor} ended`,
                        },
                    });

                    RedisManager.getInstance().publishMessageToWs(`doctors@${clinic}`, {
                        stream: `doctors@${clinic}`,
                        data: {
                            doctors: availableDoctorsWithCurrentAndTotal,
                        },
                    });
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
            case PAUSE_RESHIPI_BOOK:
                try {
                    const clinic_doctor = message.data.clinic_doctor;
                    const clinic = clinic_doctor.split("_")[0];

                    const currentReshipieBook = this.reshipieBooks.find((r) => r.title() === clinic_doctor);

                    if (!currentReshipieBook) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: RETRY_PAUSE_RESHIPI_BOOK,
                            payload: {
                                ok: false,
                                error: Errors.NOT_FOUND,
                            },
                        });
                        return;
                    }

                    const currentReshipi = currentReshipieBook.getCurrentReshipi();

                    if (currentReshipi) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: RETRY_PAUSE_RESHIPI_BOOK,
                            payload: {
                                ok: false,
                                error: Errors.BAD_REQUEST,
                            },
                        });
                        return;
                    }

                    const bookSnapshot = currentReshipieBook.getSnapshot();

                    const pausedReshipies = currentReshipieBook.pauseAll();

                    const numberOfReshipes = currentReshipieBook.getNumberOfReshipies();

                    if (numberOfReshipes > 0) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: RETRY_PAUSE_RESHIPI_BOOK,
                            payload: {
                                ok: false,
                                error: Errors.BAD_REQUEST,
                            },
                        });
                        return;
                    }

                    this.pausedReshipiBooks[clinic_doctor] = bookSnapshot;

                    this.reshipieBooks = this.reshipieBooks.filter((r) => r.title() != clinic_doctor);

                    this.availableDoctors = this.availableDoctors.filter((r) => {
                        if (`${r.clinic}_${r.doctor}` === clinic_doctor) {
                            return false;
                        } else {
                            return true;
                        }
                    });

                    const availableDoctorsWithCurrentAndTotal: {
                        doctorId: string;
                        doctorName: string;
                        ongoingNumber: number;
                        total: number;
                    }[] = [];

                    this.availableDoctors.forEach((ad) => {
                        if (ad.clinic === clinic) {
                            const rb = this.reshipieBooks.find((rb) => rb.title() === `${ad.clinic}_${ad.doctor}`);

                            if (!rb) {
                                availableDoctorsWithCurrentAndTotal.push({
                                    doctorId: ad.doctor,
                                    doctorName: ad.doctorName,
                                    ongoingNumber: 0,
                                    total: 0,
                                });
                            } else {
                                availableDoctorsWithCurrentAndTotal.push({
                                    doctorId: ad.doctor,
                                    doctorName: ad.doctorName,
                                    ongoingNumber: rb.getCurrentReshipi()?.reshipiNumber || 0,
                                    total: rb.getNumberOfReshipies(),
                                });
                            }
                        }
                    });

                    if (!availableDoctorsWithCurrentAndTotal) {
                        RedisManager.getInstance().sendToApi(clientId, {
                            type: "RETRY_PAUSE_RESHIPI_BOOK",
                            payload: {
                                ok: false,
                                error: Errors.NOT_FOUND,
                            },
                        });

                        RedisManager.getInstance().publishMessageToWs(`doctors@${clinic}`, {
                            stream: `doctors@${clinic}`,
                            data: {
                                doctors: availableDoctorsWithCurrentAndTotal,
                            },
                        });
                        return;
                    }

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RESHIPI_BOOK_PAUSED,
                        payload: {
                            ok: true,
                        },
                    });

                    RedisManager.getInstance().publishMessageToWs(`doctors@${clinic}`, {
                        stream: `doctors@${clinic}`,
                        data: {
                            doctors: availableDoctorsWithCurrentAndTotal,
                        },
                    });

                    RedisManager.getInstance().publishMessageToWs(`modified-reshipies@${clinic}`, {
                        stream: `modified-reshipies@${clinic}`,
                        data: {
                            modifiedReshipies: pausedReshipies,
                        },
                    });

                    pausedReshipies.forEach((r) => {
                        RedisManager.getInstance().publishMessageToWs(`status-update@${r.id}`, {
                            stream: `status-update@${r.id}`,
                            data: {
                                status: Status.Paused,
                                number: r.reshipiNumber,
                            },
                        });
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: RETRY_PAUSE_RESHIPI_BOOK,
                        payload: {
                            ok: false,
                            error: Errors.SOMETHING_WENT_WRONG,
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
        patientDateOfBirth: Date,
        gender: Genders,
        doctorName: string,
        symptoms: string,
        phoneNumber: string,
        paymentMethod: PaymentMethod,
        followup: boolean,
        managerId: string
    ): { newReshipi: Reshipi | null; allReshipies: Reshipi[] | null; error?: Errors } {
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
            patientDateOfBirth: patientDateOfBirth,
            doctorName: doctorName,
            gender: gender,
            symptoms: symptoms,
            paymentMethod: paymentMethod,
            phoneNumber: phoneNumber,
            followup: followup,
            managerId: managerId,
        };

        const { newReshipi, allReshipies } = ReshipiBook.addReshipi(reshipi);

        return { newReshipi: newReshipi, allReshipies: allReshipies };
    }

    private getValuesWithWildcard<V>(data: Map<string, V> | Record<string, V>, wildcard: string): V[] {
        const regex = new RegExp("^" + wildcard.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");

        const matchingValues: V[] = [];

        if (data instanceof Map) {
            for (const [key, value] of data) {
                if (typeof key === "string" && regex.test(key)) {
                    matchingValues.push(value);
                }
            }
        } else {
            for (const [key, value] of Object.entries(data)) {
                if (regex.test(key)) {
                    matchingValues.push(value as V);
                }
            }
        }

        return matchingValues;
    }

    private getRandomId() {
        let S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }
}
