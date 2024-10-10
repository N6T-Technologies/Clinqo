import { AvailableDoctorTable } from "@/types";
import { auth } from "@/auth";
import { MessageFromEngine } from "@/types/fromEngine";
import { RedisManger } from "@/lib/RedisManager";
import { GET_AVAILABLE_DOCTORS } from "shefu/from-api";
import { AVAILABLE_DOCTORS } from "shefu/to-api";
import AvailableDoctorsTable from "@/components/ui/available-doctors-table";

async function getData(clinicId: string): Promise<AvailableDoctorTable[]> {
    // Fetch data from your API here.
    const incomingData: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: GET_AVAILABLE_DOCTORS,
        data: {
            clinic: clinicId,
        },
    });

    if (!incomingData.payload.ok) {
        return [];
    }

    if (incomingData.type === AVAILABLE_DOCTORS) {
        return incomingData.payload.doctors;
    }

    return [];
}
export default async function DesktMangerDoctors() {
    const session = await auth();

    //@ts-ignore
    const clinicId = session.user.clinicId;
    const data = await getData(clinicId);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <AvailableDoctorsTable data={data} clinicId={clinicId} />
        </div>
    );
}
