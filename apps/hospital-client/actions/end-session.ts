"use server";

import { auth } from "@/auth";
import { RedisManger } from "@/lib/RedisManager";
import { StartSessionError } from "@/types";
import { MessageFromEngine } from "@/types/fromEngine";
import { END_RESHIPI_BOOK } from "shefu/from-api";
import { RESHIPI_BOOK_ENDED, RETRY_END_RESHIPI_BOOK } from "shefu/to-api";
import { Errors } from "../../shefu/src/state/ReshipiBook";

export async function endSession(
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

    console.log("Reached Here");
    const response: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: END_RESHIPI_BOOK,
        data: {
            clinic_doctor: title,
        },
    });

    console.log("Reached after call");

    if (response.type === RETRY_END_RESHIPI_BOOK) {
        return { ok: response.payload.ok, error: StartSessionError.Something_Went_Wrong, msg: response.payload.msg };
    }

    if (response.type === RESHIPI_BOOK_ENDED) {
        return { ok: response.payload.ok };
    }

    return { ok: false, error: StartSessionError.Something_Went_Wrong };
}
