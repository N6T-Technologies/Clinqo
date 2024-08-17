
import { ClinicRegForm } from "@/components/auth/clinic-reg-form";
import { MultiFormStep } from "@/types";

const steps: MultiFormStep[]= [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: ["firstName", "lastName", "email"],
  },
  {
    id: "Step 2",
    name: "Address",
    fields: ["country", "state", "city", "street", "zip"],
  },
  { id: "Step 3", name: "Complete" },
];

export default function Dashboard() {
    return (<div>
        <ClinicRegForm />
    </div>)
}
