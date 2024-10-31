import { auth } from "@/auth";
import AppointmentCard from "@/components/ui/appointment-card";
import { Genders } from "@repo/db/client";

export type DoctorAppointmentData = {
    id: string;
    number: number;
    patientName: string;
    gender: Genders;
    folloup: boolean;
    age: number;
    symtoms: string;
};

//TODO: Use recoil state management for started clinic

export default async function DoctorAppointments() {
    const session = await auth();

    //@ts-ignore
    const doctorId = session.user.doctorId;

    return (
        <>
            <AppointmentCard doctorId={doctorId} />
        </>
    );
}
