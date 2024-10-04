import { Reshipi } from "../state/ReshipiBook";

export const RESHIPI_CREATED = "RESHIPI_CREATED";
export const RESHIPI_STARTED = "RESHIPI_STARTED";
export const RESHIPI_ENDED = "RESHIPI_ENDED";
export const RESHIPI_CANCELLED = "RESHIPI_CANCELLED";
export const RETRY_CREATE_RESHIPI = "RETRY_CREATE_RESHIPI";
export const RETRY_CANCEL_RESHIPI = "RETRY_CANCEL_RESHIPI";
export const RETRY_START_RESHIPI = "RETRY_START_RESHIPI";
export const RETRY_END_RESHIPI = "RETRY_END_RESHIPI";
export const ONGOING_RESHIPI = "ONGOING_RESHIPI";
export const DEPTH = "DEPTH";
export const RETRY_DEPTH = "RETRY_DEPTH";

export type MessageToApi =
    | {
          type: typeof RESHIPI_CREATED;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof RESHIPI_CANCELLED;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof RETRY_CREATE_RESHIPI;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof RETRY_CANCEL_RESHIPI;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof RESHIPI_STARTED;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof RETRY_START_RESHIPI;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof ONGOING_RESHIPI;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof RESHIPI_ENDED;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof RETRY_END_RESHIPI;
          payload: {
              reshipiId: string;
              reshipiNumber?: number | null;
              currentReshipiNumber?: number | null;
              msg?: string;
          };
      }
    | {
          type: typeof DEPTH;
          payload: {
              reshipies: { reshipiNumber: number; reshipiInfo: Omit<Reshipi, "reshipiNumber"> }[];
          };
      }
    | {
          type: typeof RETRY_DEPTH;
          payload: {
              reshipies: null;
              msg: string;
          };
      };
