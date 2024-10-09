import { auth } from "@/auth";
import CreateAppointment from "@/components/auth/create-appointment";
import { RedisManger } from "@/lib/RedisManager";
import { GET_AVAILABLE_DOCTORS } from "shefu/from-api";

export async function getDoctors(clinicId: string) {
    const availableDoctors = await RedisManger.getInstance().sendAndAwait({
        type: GET_AVAILABLE_DOCTORS,
        data: {
            //@ts-ignore
            clinic: clinicId,
        },
    });
    if (availableDoctors.payload.ok && availableDoctors.type === "AVAILABLE_DOCTORS") {
        return availableDoctors.payload.doctors;
    } else if (availableDoctors.type === "RETRY_AVAILABLE_DOCTORS") {
        return availableDoctors.payload.error;
    }
}

export default async function CreateAppointments() {
    const session = await auth();
    //@ts-ignore
    const clinicId = session.user.clinicId;

    const res = await getDoctors(clinicId);
    if (!res) {
        return <div>RETRY</div>;
    }

    console.log(session);

    return (
        <div className="w-full">
            <CreateAppointment availableDoctors={res} clinicId={clinicId} />
        </div>
    );
}
