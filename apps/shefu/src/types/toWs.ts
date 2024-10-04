import { Reshipi } from "../state/ReshipiBook";

export type ReshipiAddedMessage = {
    stream: string;
    reshipi: Reshipi;
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

export type WsMessage = ReshipiAddedMessage | DepthUpdateMessage | CurrentNumber | NumberUpdate;
