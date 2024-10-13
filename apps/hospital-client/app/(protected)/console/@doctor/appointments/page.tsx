import { Card } from "@/components/ui/card";
import { RedisManger } from "@/lib/RedisManager";
import { GET_DEPTH_DOCTOR } from "shefu/from-api";
import { DEPTH_DOCTOR, RETRY_DEPTH_DOCTOR } from "shefu/to-api";
import { Errors } from "../../../../../../shefu/src/state/ReshipiBook";
import { auth } from "@/auth";
import { Reshipi } from "shefu/appointments";
import AppointmentCard from "@/components/ui/appointment-card";

async function getDoctorAppoitmnets(clinic_doctor: string) {
    const depth = await RedisManger.getInstance().sendAndAwait({
        type: GET_DEPTH_DOCTOR,
        data: {
            clinic_doctor: clinic_doctor,
        },
    });

    if (depth.type === RETRY_DEPTH_DOCTOR) {
        if (depth.payload.error === Errors.NOT_FOUND) {
            return { ok: false, msg: "No active sessions" };
        } else if (depth.payload.error === Errors.SOMETHING_WENT_WRONG) {
            return { ok: false, msg: "Something went wrong" };
        }
    }

    if (depth.type === DEPTH_DOCTOR) {
        return { ok: true, reshipies: depth.payload.reshipies };
    }

    return { ok: false, msg: "Something went wrong" };
}

export default async function DoctorAppointments() {
    const session = await auth();

    //@ts-ignore
    const clinics = session.user.clinics;
    //@ts-ignore
    const doctorId = session.user.doctorId;
    let ok = false;
    let msg = null;
    let reshipies:
        | {
              reshipiNumber: number;
              reshipiInfo: Omit<Reshipi, "reshipiNumber" | "doctorName">;
          }[]
        | undefined = [];

    for (let i = 0; i < clinics.length; i++) {
        const result = await getDoctorAppoitmnets(`${clinics[i].clinicId}_${doctorId}`);
        if (result.ok) {
            ok = true;
            reshipies = result.reshipies;
        } else {
            msg = result.msg;
        }
    }

    return (
        <>
            {ok ? (
                <AppointmentCard reshipies={reshipies} />
            ) : (
                <div className="h-full flex justify-center items-center text-xl">{msg}</div>
            )}
        </>
    );
}
