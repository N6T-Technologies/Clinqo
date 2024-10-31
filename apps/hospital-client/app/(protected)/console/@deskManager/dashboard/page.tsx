import { auth } from "@/auth";
import { getAppointmentData } from "../appointments/page";
import DeskManagerDashboard from "@/components/ui/desk-manager-dashboard";

export default async function DeskManagerDashboardPage() {
    const session = await auth();

    //@ts-ignore
    const clinicId = session?.user.clinicId;
    const data = await getAppointmentData(clinicId);
    return (
        <>
            <DeskManagerDashboard data={data} clinicId={clinicId} />
        </>
    );
}
