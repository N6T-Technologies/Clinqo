import { CreateAppointmentData, CREATE_RESHIPI, GET_DEPTH_CLINIC } from "shefu/from-api";

export type MessageToEngine =
    | {
          type: typeof CREATE_RESHIPI;
          data: CreateAppointmentData;
      }
    | {
          type: typeof GET_DEPTH_CLINIC;
          data: {
              clinic: string;
          };
      };
