import { auth } from "@/auth";
import DoctorDashboard from "@/components/ui/doctor-dashboard";
import { AllClinicTable } from "@/types";

export default async function Dashboard() {
    const session = await auth();

    // If session is null, handle it gracefully
    if (!session || !session.user) {
        return <div>You must be signed in to view this page.</div>;
    }

    const doctorId = (session.user as any).doctorId;
    const clinics = (session.user as any).clinics as {
        clinicId: string;
        clinicName: string;
    }[];

    const data: AllClinicTable[] = (clinics ?? []).map((c) => ({
        id: c.clinicId,
        name: c.clinicName,
        timing: "--:--",
    }));

    return <DoctorDashboard doctorId={doctorId} data={data} />;
}
