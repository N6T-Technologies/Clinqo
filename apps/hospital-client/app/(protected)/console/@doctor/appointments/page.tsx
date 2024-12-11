import { auth } from "@/auth";
import AppointmentCard from "@/components/ui/appointment-card";

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
