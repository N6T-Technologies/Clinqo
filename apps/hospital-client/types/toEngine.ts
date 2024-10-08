import { CreateAppointmentData, CREATE_RESHIPI } from "shefu/from-api";

export type MessageToEngine = {
    type: typeof CREATE_RESHIPI;
    data: CreateAppointmentData;
};
