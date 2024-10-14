import { RedisManger } from "@/lib/RedisManager";
import { GET_DEPTH_DOCTOR } from "shefu/from-api";
import { CURRENT_SESSION, DEPTH_DOCTOR, RETRY_DEPTH_DOCTOR, RETRY_GET_SESSION } from "shefu/to-api";
import { Errors } from "../../../../../../shefu/src/state/ReshipiBook";
import { auth } from "@/auth";
import { Reshipi } from "shefu/appointments";
import AppointmentCard from "@/components/ui/appointment-card";
import { MessageFromEngine } from "@/types/fromEngine";
import { Genders } from "@repo/db/client";

async function getDoctorAppoitmnets(doctorId: string): Promise<{
    ok: boolean;
    reshipies?: {
        reshipiNumber: number;
        reshipiInfo: Omit<Reshipi, "reshipiNumber" | "doctorName">;
    }[];
    msg?: string;
}> {
    const session: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: "GET_SESSION",
        data: {
            doctor: doctorId,
        },
    });

    console.log(session);

    if (session.payload.ok && session.type === CURRENT_SESSION) {
        const depth = await RedisManger.getInstance().sendAndAwait({
            type: GET_DEPTH_DOCTOR,
            data: {
                clinic_doctor: `${session.payload.clinicId}_${doctorId}`,
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
    }

    if (session.type === RETRY_GET_SESSION) {
        return { ok: false, msg: "Session not found" };
    }
    return { ok: false, msg: "Something Wend Wrong" };
}

function getAge(dob: Date) {
    const birthYear = dob.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    return age;
}

export type DoctorAppointmentData = {
    id: string;
    number: number;
    patientName: string;
    gender: Genders;
    folloup: boolean;
    age: number;
    symtoms: string;
};

//TODO: Use recoil state management for started clinic

export default async function DoctorAppointments() {
    const session = await auth();

    //@ts-ignore
    const doctorId = session.user.doctorId;

    const result = await getDoctorAppoitmnets(doctorId);

    const data: DoctorAppointmentData[] = [];

    if (result.ok && result.reshipies) {
        result.reshipies.forEach((r) => {
            data.push({
                id: r.reshipiInfo.id,
                number: r.reshipiNumber,
                patientName: `${r.reshipiInfo.patientFirstName} ${r.reshipiInfo.patientLastName}`,
                gender: r.reshipiInfo.gender,
                folloup: r.reshipiInfo.followup,
                age: getAge(r.reshipiInfo.patientDateOfBirth),
                symtoms: r.reshipiInfo.symptoms,
            });
        });
    }

    return (
        <>
            <AppointmentCard data={data} />
        </>
    );
}
