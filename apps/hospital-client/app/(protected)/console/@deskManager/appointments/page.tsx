import { Appointment } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { RegisterButton } from "@/components/ui/regiseter-button";
import { MessageFromEngine } from "@/types/fromEngine";
import { RedisManger } from "@/lib/RedisManager";
import { GET_DEPTH_CLINIC } from "shefu/from-api";
import { auth } from "@/auth";

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
    const data = await getData(session?.user.clinicId);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <div className="w-full h-4/5 px-14 pt-14">
                <DataTable
                    heading="Appointments"
                    filterField="name"
                    searchBoxPlaceholder="Fliter Patients..."
                    className="bg-white"
                    columns={columns}
                    data={data}
                />
            </div>
            <RegisterButton name="Appointment" href="/console/appointments/create" />
        </div>
    );
}
