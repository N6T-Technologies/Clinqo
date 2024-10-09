import { AvailableDoctor } from "../state/Shefu";
import { Reshipi } from "./reshipiTypes";

export type ReshipiUpdate = {
    stream: string;
    data: {
        reshipi: Reshipi;
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
        availableDoctors: {
            doctorId: string;
            doctorName: string;
        }[];
    };
};

export type WsMessage =
    | DepthUpdateMessage
    | NumberUpdate
    | TotalUpdate
    | ReshipiBooksUpdate
    | ReshipiUpdate
    | CurrentNumberUpdate;
