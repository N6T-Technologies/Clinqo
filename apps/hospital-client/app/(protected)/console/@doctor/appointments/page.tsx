import { RedisManger } from "@/lib/RedisManager";
import { GET_DEPTH_DOCTOR } from "shefu/from-api";
import { CURRENT_SESSION, DEPTH_DOCTOR, RETRY_DEPTH_DOCTOR, RETRY_GET_SESSION } from "shefu/to-api";
import { Errors } from "../../../../../../shefu/src/state/ReshipiBook";
import { auth } from "@/auth";
import { Reshipi } from "shefu/appointments";
import AppointmentCard from "@/components/ui/appointment-card";
import { MessageFromEngine } from "@/types/fromEngine";
import { Genders } from "@repo/db/client";

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

    return (
        <>
            <AppointmentCard doctorId={doctorId} />
        </>
    );
}
