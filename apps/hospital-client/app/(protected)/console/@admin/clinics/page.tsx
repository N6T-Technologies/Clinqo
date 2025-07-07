import { Clinic } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { RegisterButton } from "@/components/ui/regiseter-button";
import { getClinicsByAdminId } from "@/data/clinic";
import { auth } from "@/auth";

//TODO: Create Table for listing the clinics associated with the Admin

async function getData(id: string): Promise<Clinic[]> {
    // Fetch data from your API here.

    const rawClinics = await getClinicsByAdminId(id);

    const clinics = rawClinics.map((c) => {
        return {
            id: c.id,
            name: c.name,
            logo: c.logo,
            headName: c.clinicHeads[0]?.user.firstName || "Not Found" + c.clinicHeads[0]?.user.lastName || "Not Found",
            headEmail: c.clinicHeads[0]?.user.email || "Not Found",
        };
    });

    return clinics;
}

export default async function AdminClinics() {
    const session = await auth();

    //@ts-ignore
    const adminId = session?.user?.adminId;
    //@ts-ignore
    const data = await getData(adminId);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <div className="w-full h-4/5 px-14 pt-14">
                <DataTable
                    heading="Registered Clinics"
                    filterField="name"
                    searchBoxPlaceholder="Fliter Clinics..."
                    className="bg-white"
                    columns={columns}
                    data={data}
                />
            </div>
            <RegisterButton name="Clinic" href="/console/clinics/register" />
        </div>
    );
}
