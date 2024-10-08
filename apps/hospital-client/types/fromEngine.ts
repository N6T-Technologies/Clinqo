import { Reshipi } from "shefu/appointments";
import { RESHIPI_CREATED } from "shefu/to-api";

export type MessageFromEngine = {
    type: typeof RESHIPI_CREATED;
    payload: {
        newReshipi: Reshipi;
        depth: Reshipi[];
        ok: boolean;
        msg?: string;
    };
};
