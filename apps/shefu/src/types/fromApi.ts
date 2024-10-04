export const CREATE_RESHIPI = "CREATE_RESHIPI";
export const START_RESHIPI = "START_RESHIPI";
export const END_RESHIPI = "END_RESHIPI";
export const CANCEL_RESHIPI = "CANCEL_RESHIPI";
export const GET_DEPTH = "GET_DEPTH";
export const START_RESHIPI_BOOK = "START_RESHIPI_BOOK";

//What happens if i make this interface instead type
export type MessageFromApi =
    | {
          type: typeof CREATE_RESHIPI;
          data: {
              clinic_doctor: string;
              patientFirstName: string;
              patientLastName: string;
              patientAge: string;
              symptoms: string;
              phoneNumber: string;
              followup: boolean;
              managerId: string;
          };
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
          type: typeof GET_DEPTH;
          data: {
              clinic_doctor: string;
          };
      }
    | {
          type: typeof START_RESHIPI_BOOK;
          data: {
              clinic_doctor: string;
          };
      };
