"use server";

import { auth } from "@/auth";
import { RedisManger } from "@/lib/RedisManager";
import { StartSessionError } from "@/types";
import { MessageFromEngine } from "@/types/fromEngine";
import { START_RESHIPI_BOOK } from "shefu/from-api";
import { RESHIPI_BOOK_STARTED, RETRY_RESHIPI_BOOK_START } from "shefu/to-api";
import { Errors } from "../../shefu/src/state/ReshipiBook";

export async function startSession(
    clinic: string
): Promise<{ ok: boolean; error?: Errors | StartSessionError; msg?: string }> {
    const session = await auth();

    if (!session || !session.user) {
        return { ok: false, error: StartSessionError.No_Creadentials };
    }

    //@ts-ignore
    const doctorName = session.user.name;
    //@ts-ignore
    const doctorId = session.user.doctorId;

    //@ts-ignore
    if (!doctorId) {
        return { ok: false, error: StartSessionError.Unauthorized };
    }
    if (!doctorName) {
        return { ok: false, error: StartSessionError.Doctor_Not_Found };
    }
    //@ts-ignore
    if (!session.user.clinics.find((c) => c.clinicId === clinic)) {
        return { ok: false, error: StartSessionError.Clinic_Not_Found };
    }

    const title = `${clinic}_${doctorId}`;

    const response: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: START_RESHIPI_BOOK,
        data: {
            clinic_doctor: title,
            doctorName: doctorName,
        },
    });

    if (response.type === RETRY_RESHIPI_BOOK_START) {
        return { ok: response.payload.ok, error: response.payload.error, msg: response.payload.msg };
    }

    if (response.type === RESHIPI_BOOK_STARTED) {
        return { ok: response.payload.ok, msg: response.payload.msg };
    }

    return { ok: false, error: Errors.SOMETHING_WENT_WRONG };
}
