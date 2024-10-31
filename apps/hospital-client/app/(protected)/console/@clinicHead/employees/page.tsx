import { Employee } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { RegisterButton } from "@/components/ui/regiseter-button";
import { auth } from "@/auth";
import { getEmployeesByClinicHeadId } from "@/data/employees";

async function getData(id: string): Promise<Employee[]> {
    // Fetch data from your API here.
    //
    const rawEmployees = await getEmployeesByClinicHeadId(id);

    const employees = rawEmployees.map((re) => {
        return {
            id: re.id,
            name: `${re.user.firstName} ${re.user.lastName}`,
            email: re.user.email,
        };
    });

    return employees;
}
export default async function AdminEmployees() {
    const session = await auth();

    //@ts-ignore
    const clinicHeadId = session.user.clinicHeadId;
    const data = await getData(clinicHeadId);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <div className="w-full h-4/5 px-14 pt-14">
                <DataTable
                    heading="Employees"
                    filterField="name"
                    searchBoxPlaceholder="Fliter Employees..."
                    className="bg-white"
                    columns={columns}
                    data={data}
                />
            </div>
            <RegisterButton name="Employee" href="/console/employees/register" />
        </div>
    );
}
