import { auth } from "@/auth";
import DoctorDashboard from "@/components/ui/doctor-dashboard";
import { AllClinicTable } from "@/types";

export default async function Dashboard() {
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
        <>
            <DoctorDashboard doctorId={doctorId} data={data} />
        </>
    );
}
