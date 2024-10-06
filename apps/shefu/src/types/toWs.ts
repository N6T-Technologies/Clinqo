import { Reshipi } from "../state/ReshipiBook";

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

export type WsMessage = ReshipiAddedMessage | DepthUpdateMessage | CurrentNumber | NumberUpdate | TotalUpdate;
