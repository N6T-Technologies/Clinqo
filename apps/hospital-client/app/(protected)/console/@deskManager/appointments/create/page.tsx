import CreateAppointment from "@/components/auth/create-appointment";

export default async function CreateAppointments() {
    //TODO: get this available doctors from ws server form Subscribing to doctors@{clinic_id}
    const availableDoctors = [
        {
            doctorName: "Mayur Pachpor",
            doctorId: "cm1y2kvew0000127ceirm0jr4",
        },
    ];

    return (
        <div className="w-full">
            <CreateAppointment availableDoctors={availableDoctors} />
        </div>
    );
}
