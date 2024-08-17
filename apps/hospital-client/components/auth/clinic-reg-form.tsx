"use client";

import { StepInfo } from "@/types";
import { Stepper } from "../ui/stepper";

const formSteps: StepInfo[] = [
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

export const ClinicRegForm = () => {
    return (
        <div className="p-16">
            <div>
                <Stepper formSteps={formSteps} />
            </div>
        </div>
    );
};
