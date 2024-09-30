export const RESHIPI_CREATED = "RESHIPI_CREATED";
export const RESHIPI_STARTED = "RESHIPI_STARTED";
export const RESHIPI_ENDED = "RESHIPI_ENDED";
export const RESHIPI_CANCELLED = "RESHIPI_CANCELLED";
export const RETRY_CREATE_RESHIPI = "RETRY_CREATE_RESHIPI";
export const RETRY_CANCEL_RESHIPI = "RETRY_CANCEL_RESHIPI";
export const DEPTH = "DEPTH";

export type MessageToApi =
    | {
          type: typeof RESHIPI_CREATED;
          payload: {
              reshipiId: string;
              reshipiNumber: number;
          };
      }
    | {
          type: typeof RESHIPI_CANCELLED;
          payload: {
              reshipiId: string;
              reshipiNumber: number;
          };
      }
    | {
          type: typeof RETRY_CREATE_RESHIPI;
          payload: {
              reshipiId: string;
              reshipiNumber: number;
          };
      }
    | {
          type: typeof RETRY_CANCEL_RESHIPI;
          payload: {
              reshipiId: string;
              reshipiNumber: number;
          };
      };
