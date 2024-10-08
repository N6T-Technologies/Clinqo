import { Reshipi } from "shefu/appointments";
import { DEPTH_CLINIC, RESHIPI_CREATED } from "shefu/to-api";

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
      };
