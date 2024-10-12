import { Reshipi, Status } from "./reshipiTypes";

export type ReshipiUpdate = {
    stream: string;
    data: {
        reshipi: Reshipi;
    };
};

export type CancellationUpdate = {
    stream: string;
    data: {
        reshipies: Reshipi[];
        removedReshipi: Reshipi;
    };
};

export type DepthUpdateMessage = {
    stream: string;
    data: {
        depth: Reshipi[];
    };
};

export type CurrentNumberUpdate = {
    stream: string;
    data: {
        currentNumber: number;
    };
};

export type NumberUpdate = {
    stream: string;
    data: {
        newNumber: number;
    };
};

export type TotalUpdate = {
    stream: string;
    data: {
        totalNumber: number;
    };
};

export type ReshipiBooksUpdate = {
    stream: string;
    data: {
        doctors: {
            doctorId: string;
            doctorName: string;
            ongoingNumber: number;
            total: number;
        }[];
    };
};

export type ModifiedReshipies = {
    stream: string;
    data: {
        modifiedReshipies: Reshipi[];
    };
};

export type ReshipiDetailsUpdate = {
    stream: string;
    data: {
        status: Status;
        number: number;
    };
};

export type WsMessage =
    | DepthUpdateMessage
    | NumberUpdate
    | TotalUpdate
    | ReshipiBooksUpdate
    | ReshipiUpdate
    | CurrentNumberUpdate
    | CancellationUpdate
    | ModifiedReshipies
    | ReshipiDetailsUpdate;
