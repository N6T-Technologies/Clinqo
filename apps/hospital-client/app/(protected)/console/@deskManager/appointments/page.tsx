import { Appointment } from "@/types";
import { Status } from "shefu/appointments";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { RegisterButton } from "@/components/ui/regiseter-button";

async function getData(): Promise<Appointment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            number: 2,
            name: "Rakshas Kumar Sigh",
            doctorName: "Sanat Behera",
            status: Status.Created,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Canceled,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Created,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Canceled,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Ongoing,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Created,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Canceled,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Canceled,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Created,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Created,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Ongoing,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Completed,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Created,
        },
        {
            id: "728ed52f",
            number: 2,
            name: "Clinqo Hospital",
            doctorName: "Sanat Behera",
            status: Status.Ongoing,
        },
        // ...
    ];
}
export default async function DeskManagerAppointments() {
    const data = await getData();

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <div className="w-full h-4/5 px-14 pt-14">
                <DataTable
                    heading="Appointments"
                    filterField="name"
                    searchBoxPlaceholder="Fliter Patients..."
                    className="bg-white"
                    columns={columns}
                    data={data}
                />
            </div>
            <RegisterButton name="Appointment" href="/console/appointments/create" />
        </div>
    );
}
