import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clinic } from "@/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card } from "@/components/ui/card";

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
        <div className="w-full h-full flex flex-col space-y-6 items-center justify-center">
            <div className="w-full px-16">
                <Card className="shadow-md">
                    <DataTable columns={columns} data={data} />
                </Card>
            </div>
            <div>
                <form
                    action={async () => {
                        "use server";

                        redirect("/console/clinics/register");
                    }}
                >
                    <Button variant="clinqo" type="submit">
                        Register Clinic
                    </Button>
                </form>
            </div>
        </div>
    );
}
