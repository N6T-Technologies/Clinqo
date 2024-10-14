import { auth } from "@/auth";
import DoctorClinicTable from "@/components/ui/doctor-clinic-table";
import { RedisManger } from "@/lib/RedisManager";
import { AllClinicTable } from "@/types";
import { MessageFromEngine } from "@/types/fromEngine";
import { CURRENT_SESSION, RETRY_GET_SESSION } from "shefu/to-api";

//TODO: create endpoint for getSession
async function getSession(doctorId: string) {
    const result: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: "GET_SESSION",
        data: {
            doctor: doctorId,
        },
    });

    if (result.type === CURRENT_SESSION) {
        return { ok: true, currentSession: result.payload.clinicId };
    }

    if (result.type === RETRY_GET_SESSION) {
        return { ok: false, currentSession: "" };
    }
    return { ok: false, currentSession: "" };
}

export default async function DoctorClinics() {
    const session = await auth();

    //@ts-ignore
    const doctorId = session.user.doctorId;
    //@ts-ignore
    const clinics: { clinicId: string; clinicName: string }[] = session.user.clinics;

    const data: AllClinicTable[] = clinics.map((c) => {
        return {
            id: c.clinicId,
            name: c.clinicName,
            timing: "--:--",
        };
    });

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <DoctorClinicTable data={data} doctorId={doctorId} />
        </div>
    );
}
