import { Reshipi } from "shefu/appointments";
import {
    AVAILABLE_DOCTORS,
    CURRENT_SESSION,
    DEPTH_CLINIC,
    DEPTH_DOCTOR,
    ONGOING_RESHIPI,
    RESHIPI_BOOK_ENDED,
    RESHIPI_BOOK_STARTED,
    RESHIPI_CREATED,
    RESHIPI_ENDED,
    RESHIPI_STARTED,
    RETRY_AVAILABLE_DOCTORS,
    RETRY_DEPTH_DOCTOR,
    RETRY_END_RESHIPI,
    RETRY_END_RESHIPI_BOOK,
    RETRY_GET_ONGOING_RESHIPI,
    RETRY_GET_SESSION,
    RETRY_RESHIPI_BOOK_START,
    RETRY_START_RESHIPI,
} from "shefu/to-api";
import { Errors } from "../../shefu/src/state/ReshipiBook";
import { AvailableDoctorTable } from ".";

export type MessageFromEngine =
    | {
          type: typeof RESHIPI_CREATED;
          payload: {
              newReshipi: Reshipi;
              depth: Reshipi[];
              ok: boolean;
          };
      }
    | {
          type: typeof DEPTH_CLINIC;
          payload: {
              ok: boolean;
              doctorReshipies: {
                  doctorName: string;
                  reshipies: { reshipiNumber: number; reshipiInfo: Omit<Reshipi, "reshipiNumber" | "doctor"> }[];
              }[];
          };
      }
    | {
          type: typeof AVAILABLE_DOCTORS;
          payload: {
              ok: boolean;
              doctors: AvailableDoctorTable[];
          };
      }
    | {
          type: typeof RETRY_AVAILABLE_DOCTORS;
          payload: {
              ok: boolean;
              error: Errors;
          };
      }
    | {
          type: typeof DEPTH_DOCTOR;
          payload: {
              ok: boolean;

              reshipies: {
                  reshipiNumber: number;
                  reshipiInfo: Omit<Reshipi, "reshipiNumber" | "doctorName">;
              }[];
          };
      }
    | {
          type: typeof RETRY_DEPTH_DOCTOR;
          payload: {
              ok: boolean;
              error: Errors;
              msg?: string;
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
          type: typeof CURRENT_SESSION;
          payload: {
              ok: boolean;
              clinicId: string;
          };
      }
    | {
          type: typeof RETRY_GET_SESSION;
          payload: {
              ok: boolean;
              error: Errors;
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
              reshipiId?: string;
              reshipi?: Reshipi;
              msg?: string;
          };
      }
    | {
          type: typeof RETRY_GET_ONGOING_RESHIPI;
          payload: {
              ok: boolean;
              error: Errors;
              msg?: string;
          };
      };
