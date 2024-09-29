export const CREATE_RESHIPI = "CREATE_RESHIPI";
export const START_RESHIPI = "START_RESHIPI";
export const END_RESHIPI = "END_RESHIPI";
export const CANCEL_RESHIPI = "CANCEL_RESHIPI";
export const GET_DEPTH = "GET_DEPTH";

//What happens if i make this interface instead type
export type MessageFromApi =
    | {
          type: typeof CREATE_RESHIPI;
          data: {
              doctor: string;
              clinic: string;
              patientFirstName: string;
              patientLastName: string;
              patientAge: string;
              symptoms: string;
              phoneNumber: string;
              followup: boolean;
              managerId: string;
              date: Date;
          };
      }
    | {
          type: typeof CANCEL_RESHIPI;
          data: {
              id: string;
              doctor: string;
              clinic: string;
          };
      }
    | {
          type: typeof START_RESHIPI;
          data: {
              id: string;
              doctor: string;
              clinic: string;
          };
      }
    | {
          type: typeof END_RESHIPI;
          data: {
              id: string;
              doctor: string;
              clinic: string;
          };
      }
    | {
          type: typeof GET_DEPTH;
          data: {
              doctor: string;
              clinic: string;
          };
      };
