import {
    DepthUpdateMessage,
    NumberUpdate,
    TotalUpdate,
    CurrentNumberUpdate,
    ReshipiUpdate,
    ReshipiBooksUpdate,
} from "shefu/src/types/toWs";

export type OutgoingMessages =
    | DepthUpdateMessage
    | NumberUpdate
    | TotalUpdate
    | CurrentNumberUpdate
    | ReshipiBooksUpdate
    | ReshipiUpdate;
