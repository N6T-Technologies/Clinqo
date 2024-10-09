import { Genders, PaymentMethod } from "@repo/db/src";

export const CREATE_RESHIPI = "CREATE_RESHIPI";
export const START_RESHIPI = "START_RESHIPI";
export const END_RESHIPI = "END_RESHIPI";
export const CANCEL_RESHIPI = "CANCEL_RESHIPI";
export const GET_DEPTH_CLINIC = "GET_DEPTH_CLINIC";
export const GET_DEPTH_DOCTOR = "GET_DEPTH_DOCTOR";
export const GET_AVAILABLE_DOCTORS = "GET_AVAILABLE_DOCTORS";
export const START_RESHIPI_BOOK = "START_RESHIPI_BOOK";
export const END_RESHIPI_BOOK = "END_RESHIPI_BOOK";

//What happens if i make this interface instead type

export type CreateAppointmentData = {
    clinic_doctor: string;
    patientFirstName: string;
    patientLastName: string;
    patientDateOfBirth: Date;
    gender: Genders;
    symptoms: string;
    phoneNumber: string;
    paymentMethod: PaymentMethod;
    followup: boolean;
    managerId: string;
};

export type MessageFromApi =
    | {
          type: typeof CREATE_RESHIPI;
          data: CreateAppointmentData;
      }
    | {
          type: typeof CANCEL_RESHIPI;
          data: {
              id: string;
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
          type: typeof END_RESHIPI;
          data: {
              clinic_doctor: string;
          };
      }
    | {
          type: typeof GET_DEPTH_DOCTOR;
          data: {
              clinic_doctor: string;
          };
      }
    | {
          type: typeof GET_DEPTH_CLINIC;
          data: {
              clinic: string;
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
          type: typeof END_RESHIPI_BOOK;
          data: {
              clinic_doctor: string;
          };
      }
    | {
          type: typeof GET_AVAILABLE_DOCTORS;
          data: {
              clinic: string;
          };
      };
