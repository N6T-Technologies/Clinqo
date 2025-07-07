"use server";

import { auth } from "@/auth";
import { RedisManger } from "@/lib/RedisManager";
import { EndAppointmentError } from "@/types";
import { MessageFromEngine } from "@/types/fromEngine";
import { START_RESHIPI } from "shefu/from-api";
import { RESHIPI_STARTED, RETRY_START_RESHIPI } from "shefu/to-api";

export async function startAppointment(clinicId: string) {
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
    const userClinics: { clinicId: string; clinicName: string }[] = session.user.clinics || [];
    if (!userClinics.find((c: { clinicId: string; clinicName: string }) => c.clinicId === clinicId)) {
        return { ok: false, error: EndAppointmentError.Clinic_Not_Found };
    }

    const title = `${clinicId}_${doctorId}`;

    const startResult: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: START_RESHIPI,
        data: {
            clinic_doctor: title,
        },
    });

    if (startResult.type === RESHIPI_STARTED) {
        return { ok: true, currentAppointment: startResult.payload.reshipi };
    }
    if (startResult.type === RETRY_START_RESHIPI) {
        return { ok: false, msg: startResult.payload.msg };
    }

    return { ok: false };
}
