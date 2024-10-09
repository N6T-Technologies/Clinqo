import { Appointment } from "@/types";
import { RegisterButton } from "@/components/ui/regiseter-button";
import { MessageFromEngine } from "@/types/fromEngine";
import { RedisManger } from "@/lib/RedisManager";
import { GET_DEPTH_CLINIC } from "shefu/from-api";
import { auth } from "@/auth";
import AppointmentsTable from "@/components/ui/appointmets-table";

async function getData(clinicId: string): Promise<Appointment[]> {
    // Fetch data from your API here.
    const incomingData: MessageFromEngine = await RedisManger.getInstance().sendAndAwait({
        type: GET_DEPTH_CLINIC,
        data: {
            clinic: clinicId,
        },
    });

    if (!incomingData.payload.ok) {
        return [];
    }

    const data: Appointment[] = [];

    //@ts-ignore
    incomingData.payload.doctorReshipies.forEach((dr) => {
        //@ts-ignore
        dr.reshipies.forEach((r) => {
            const newAppointment = {
                id: r.reshipiInfo.id,
                number: r.reshipiNumber,
                name: r.reshipiInfo.patientFirstName + " " + r.reshipiInfo.patientLastName,
                doctorName: dr.doctorName,
                status: r.reshipiInfo.status,
            };
            //@ts-ignore
            data.push(newAppointment);
        });
    });
    return data;
}
export default async function DeskManagerAppointments() {
    const session = await auth();

    //@ts-ignore
    const clinicId = session?.user.clinicId;
    const data = await getData(clinicId);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <AppointmentsTable data={data} clinicId={clinicId} />
            <RegisterButton name="Appointment" href="/console/appointments/create" />
        </div>
    );
}
