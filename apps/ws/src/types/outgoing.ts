import {
    CurrentNumber,
    DepthUpdateMessage,
    NumberUpdate,
    ReshipiAddedMessage,
    StartReshipiBook,
    TotalUpdate,
} from "shefu/src/types/toWs";

export type OutgoingMessages =
    | ReshipiAddedMessage
    | DepthUpdateMessage
    | CurrentNumber
    | NumberUpdate
    | TotalUpdate
    | StartReshipiBook;
