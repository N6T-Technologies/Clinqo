import { Reshipi } from "shefu/appointments";
import { AVAILABLE_DOCTORS, DEPTH_CLINIC, RESHIPI_CREATED, RETRY_AVAILABLE_DOCTORS } from "shefu/to-api";
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
      };
