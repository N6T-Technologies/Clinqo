export const RESHIPI_CREATED = "RESHIPI_CREATED";
export const RESHIPI_STARTED = "RESHIPI_STARTED";
export const RESHIPI_ENDED = "RESHIPI_ENDED";
export const RESHIPI_CANCELLED = "RESHIPI_CANCELLED";
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
      };
