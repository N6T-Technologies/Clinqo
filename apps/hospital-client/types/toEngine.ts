import {
    CreateAppointmentData,
    CREATE_RESHIPI,
    GET_DEPTH_CLINIC,
    GET_AVAILABLE_DOCTORS,
    GET_DEPTH_DOCTOR,
    START_RESHIPI_BOOK,
    GET_SESSION,
    END_RESHIPI_BOOK,
    END_RESHIPI,
    START_RESHIPI,
    GET_ONGOING_RESHIPI,
} from "shefu/from-api";

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
      }
    | {
          type: typeof GET_AVAILABLE_DOCTORS;
          data: {
              clinic: string;
          };
      }
    | {
          type: typeof GET_DEPTH_DOCTOR;
          data: {
              clinic_doctor: string;
          };
      }
    | {
          type: typeof START_RESHIPI_BOOK;
          data: {
              clinic_doctor: string;
              doctorName: string;
          };
      }
    | {
          type: typeof GET_SESSION;
          data: {
              doctor: string;
          };
      }
    | {
          type: typeof END_RESHIPI_BOOK;
          data: {
              clinic_doctor: string;
          };
      }
    | {
          type: typeof END_RESHIPI;
          data: {
              clinic_doctor: string;
          };
      }
    | {
          type: typeof START_RESHIPI;
          data: {
              clinic_doctor: string;
          };
      }
    | {
          type: typeof GET_ONGOING_RESHIPI;
          data: {
              clinic_doctor: string;
          };
      };
