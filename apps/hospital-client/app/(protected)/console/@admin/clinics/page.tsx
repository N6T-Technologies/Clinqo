import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

//TODO: Create Table for listing the clinics associated with the Admin

export default function AdminClinics() {
    return (
        <div className="h-full flex items-center justify-center">
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
    );
}
