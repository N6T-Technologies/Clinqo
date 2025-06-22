import { auth } from "@/auth";
import DoctorDashboard from "@/components/ui/doctor-dashboard";
import { AllClinicTable } from "@/types";

export default async function Dashboard() {
    const session = await auth();

    if (!session?.user) {
        return <div>Authentication required</div>;
    }

    //@ts-ignore
    const doctorId = session.user.doctorId;
    //@ts-ignore
    const clinics: { clinicId: string; clinicName: string }[] = session.user.clinics || [];

    // Handle case where clinics is undefined or not an array
    const safeClinicsList = Array.isArray(clinics) ? clinics : [];

    const data: AllClinicTable[] = safeClinicsList.map((c) => {
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
