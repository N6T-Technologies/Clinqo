import { Reshipi } from "../state/ReshipiBook";
import { AvailableDoctor } from "../state/Shefu";

export type ReshipiAddedMessage = {
    stream: string;
    data: {
        depth: Reshipi[];
    };
};

export type DepthUpdateMessage = {
    stream: string;
    data: {
        reshipies: Reshipi[];
        cancelledReshipi: Reshipi;
    };
};

export type CurrentNumber = {
    stream: string;
    data: {
        number: number;
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

export type StartReshipiBook = {
    stream: string;
    data: {
        availableDoctors: AvailableDoctor[];
    };
};

export type WsMessage =
    | ReshipiAddedMessage
    | DepthUpdateMessage
    | CurrentNumber
    | NumberUpdate
    | TotalUpdate
    | StartReshipiBook;
