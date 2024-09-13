import { Clinic } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { RegisterButton } from "@/components/ui/regiseter-button";

//TODO: Create Table for listing the clinics associated with the Admin

async function getData(): Promise<Clinic[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Mayur Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        {
            id: "728ed52f",
            name: "Clinqo Hospital",
            headName: "Sanat Behera",
            headEmail: "sannyb@gmail.com",
        },
        // ...
    ];
}

export default async function AdminClinics() {
    const data = await getData();

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
