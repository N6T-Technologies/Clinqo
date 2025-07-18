import { auth } from "@/auth";
import DeskManagerDashboard from "@/components/ui/desk-manager-dashboard";
import { RedisManger } from "@/lib/RedisManager";
import { Appointment } from "@/types";
import { MessageFromEngine } from "@/types/fromEngine";
import { GET_DEPTH_CLINIC } from "shefu/from-api";
import { DEPTH_CLINIC } from "shefu/to-api";

async function getAppointmentData(clinicId: string): Promise<Appointment[]> {
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

    if (incomingData.type === DEPTH_CLINIC) {
        incomingData.payload.doctorReshipies.forEach((dr) => {
            dr.reshipies.forEach((r) => {
                const newAppointment = {
                    id: r.reshipiInfo.id,
                    number: r.reshipiNumber,
                    name: r.reshipiInfo.patientFirstName + " " + r.reshipiInfo.patientLastName,
                    doctorName: dr.doctorName,
                    status: r.reshipiInfo.status,
                };
                data.push(newAppointment);
            });
        });
        return data;
    }

    return data;
}
export default async function DeskManagerDashboardPage() {
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
                    <p className="text-gray-600">Please log in to continue.</p>
                </div>
            </div>
        );
    }

    //@ts-ignore
    const clinicId = session?.user.clinicId;
    
    if (!clinicId) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">No Clinic Assigned</h2>
                    <p className="text-gray-600">You haven't been assigned to any clinic yet. Please contact your administrator.</p>
                </div>
            </div>
        );
    }
    
    const data = await getAppointmentData(clinicId);
    return (
        <>
            <DeskManagerDashboard data={data} clinicId={clinicId} />
        </>
    );
}
