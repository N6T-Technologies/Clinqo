import { auth } from "@/auth";
import DoctorClinicTable from "@/components/ui/doctor-clinic-table";
import { AllClinicTable } from "@/types";

export default async function DoctorClinics() {
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
    const doctorId = session.user.doctorId;
    //@ts-ignore
    const clinics: { clinicId: string; clinicName: string }[] = session.user.clinics || [];

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
