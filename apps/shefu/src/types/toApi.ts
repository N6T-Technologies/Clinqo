import { Errors } from "../state/ReshipiBook";
import { Reshipi } from "./reshipiTypes";

export const RESHIPI_CREATED = "RESHIPI_CREATED";
export const RESHIPI_STARTED = "RESHIPI_STARTED";
export const RESHIPI_ENDED = "RESHIPI_ENDED";
export const RESHIPI_CANCELLED = "RESHIPI_CANCELLED";
export const RETRY_CREATE_RESHIPI = "RETRY_CREATE_RESHIPI";
export const RETRY_CANCEL_RESHIPI = "RETRY_CANCEL_RESHIPI";
export const RETRY_START_RESHIPI = "RETRY_START_RESHIPI";
export const RETRY_END_RESHIPI = "RETRY_END_RESHIPI";
export const ONGOING_RESHIPI = "ONGOING_RESHIPI";
export const DEPTH_DOCTOR = "DEPTH_DOCTOR";
export const RETRY_DEPTH_DOCTOR = "RETRY_DEPTH_DOCTOR";
export const DEPTH_CLINIC = "DEPTH_CLINIC";
export const RETRY_DEPTH_CLINIC = "RETRY_DEPTH_CLINIC";
export const RESHIPI_BOOK_STARTED = "RESHIPI_BOOK_STARTED";
export const RETRY_RESHIPI_BOOK_START = "RETRY_RESHIPI_BOOK_START";
export const RESHIPI_BOOK_ENDED = "RESHIPI_BOOK_ENDED";
export const RETRY_END_RESHIPI_BOOK = "RETRY_END_RESHIPI_BOOK";

export type MessageToApi =
    | {
          type: typeof RESHIPI_CREATED;
          payload: {
              newReshipi: Reshipi;
              depth: Reshipi[];
              ok: boolean;
          };
      }
    | {
          type: typeof RESHIPI_CANCELLED;
          payload: {
              ok: boolean;
              id: string;
          };
      }
    | {
          type: typeof RETRY_CREATE_RESHIPI;
          payload: {
              ok: boolean;
              msg: string;
          };
      }
    | {
          type: typeof RETRY_CANCEL_RESHIPI;
          payload: {
              ok: boolean;
              msg?: string;
          };
      }
    | {
          type: typeof RESHIPI_STARTED;
          payload: {
              ok: boolean;
              reshipiId: string;
          };
      }
    | {
          type: typeof RETRY_START_RESHIPI;
          payload: {
              ok: boolean;
              msg: string;
          };
      }
    | {
          type: typeof ONGOING_RESHIPI;
          payload: {
              ok: boolean;
              reshipiId: string;
              msg: string;
          };
      }
    | {
          type: typeof RESHIPI_ENDED;
          payload: {
              ok: boolean;
              reshipiId: string;
              currentReshipiNumber: number | null;
          };
      }
    | {
          type: typeof RETRY_END_RESHIPI;
          payload: {
              ok: boolean;
              msg: string;
          };
      }
    | {
          type: typeof DEPTH_DOCTOR;
          payload: {
              ok: boolean;
              reshipies: { reshipiNumber: number; reshipiInfo: Omit<Reshipi, "reshipiNumber"> }[];
          };
      }
    | {
          type: typeof RETRY_DEPTH_DOCTOR;
          payload: {
              ok: boolean;
              reshipies: null;
              msg: string;
          };
      }
    | {
          type: typeof DEPTH_CLINIC;
          payload: {
              ok: boolean;
              doctorReshipies: {
                  doctor: string;
                  reshipies: { reshipiNumber: number; reshipiInfo: Omit<Reshipi, "reshipiNumber" | "doctor"> }[];
              }[];
          };
      }
    | {
          type: typeof RETRY_DEPTH_CLINIC;
          payload: {
              ok: boolean;
              doctorReshipies: null;
              msg: string;
          };
      }
    | {
          type: typeof RESHIPI_BOOK_STARTED;
          payload: {
              ok: boolean;
              msg: string;
          };
      }
    | {
          type: typeof RETRY_RESHIPI_BOOK_START;
          payload: {
              ok: boolean;
              error: Errors;
              msg: string;
          };
      }
    | {
          type: typeof RESHIPI_BOOK_ENDED;
          payload: {
              ok: boolean;
              msg: string;
          };
      }
    | {
          type: typeof RETRY_END_RESHIPI_BOOK;
          payload: {
              ok: boolean;
              error: Errors;
              msg: string;
          };
      };
