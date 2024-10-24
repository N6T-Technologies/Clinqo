import { Doctor } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { RegisterButton } from "@/components/ui/regiseter-button";
import { getDoctorsUsingClinicHeadId } from "@/data/doctors";
import { auth } from "@/auth";

async function getData(id: string): Promise<Doctor[]> {
    // Fetch data from your API here.

    const rawDoctors = await getDoctorsUsingClinicHeadId(id);

    const doctors = rawDoctors.map((d) => {
        return {
            id: d.id,
            doctorName: "Dr." + d.user.firstName + d.user.lastName,
            timing: "--:--",
            doctorEmail: d.user.email,
        };
    });

    return doctors;
}
export default async function AdminDoctors() {
    const session = await auth();

    //@ts-ignore
    const clinicHeadId = session.user.clinicHeadId;
    const data = await getData(clinicHeadId);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <div className="w-full h-4/5 px-14 pt-14">
                <DataTable
                    heading="Employees"
                    filterField="doctorName"
                    searchBoxPlaceholder="Fliter doctors..."
                    className="bg-white"
                    columns={columns}
                    data={data}
                />
            </div>
            <RegisterButton name="Doctor" href="/console/doctors/register" />
        </div>
    );
}
