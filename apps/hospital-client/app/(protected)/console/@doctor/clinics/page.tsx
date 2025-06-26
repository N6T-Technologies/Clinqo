import { auth } from "@/auth";
import DoctorClinicTable from "@/components/ui/doctor-clinic-table";
import { AllClinicTable } from "@/types";

export default async function DoctorClinics() {
    const session = await auth();

    //@ts-ignore
    const doctorId = session.user.doctorId;
    //@ts-ignore
    const clinics: { clinicId: string; clinicName: string }[] = session.user.clinics;

    const data: AllClinicTable[] = (clinics ?? []).map((c) => {
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
