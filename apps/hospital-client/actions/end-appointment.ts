"use server";

import { auth } from "@/auth";
import { RedisManger } from "@/lib/RedisManager";
import { EndAppointmentError } from "@/types";
import { MessageFromEngine } from "@/types/fromEngine";
import { END_RESHIPI } from "shefu/from-api";
import { RESHIPI_ENDED, RETRY_END_RESHIPI } from "shefu/to-api";

export async function endAppointment(clinicId: string) {
    const session = await auth();

    if (!session || !session.user) {
        return { ok: false, error: EndAppointmentError.No_Creadentials };
    }

    //@ts-ignore
    const doctorName = session.user.name;
    //@ts-ignore
    const doctorId = session.user.doctorId;

    //@ts-ignore
    if (!doctorId) {
        return { ok: false, error: EndAppointmentError.Unauthorized };
    }
    if (!doctorName) {
        return { ok: false, error: EndAppointmentError.Doctor_Not_Found };
    }
    //@ts-ignore
    if (!session.user.clinics.find((c) => c.clinicId === clinicId)) {
        return { ok: false, error: EndAppointmentError.Clinic_Not_Found };
    }

    const title = `${clinicId}_${doctorId}`;

    const result: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: END_RESHIPI,
        data: {
            clinic_doctor: title,
        },
    });

    if (result.type === RESHIPI_ENDED) {
        return { ok: true };
    }

    if (result.type === RETRY_END_RESHIPI) {
        return { ok: false, msg: "Current Appointment could not end" };
    }

    return { ok: false, msg: EndAppointmentError.Something_Went_Wrong };
}
