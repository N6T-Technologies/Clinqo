"use client";

import { StepInfo } from "@/types";
import { Stepper } from "../ui/stepper";
import { useState } from "react";
import { Button } from "../ui/button";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

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
    const [currentStep, setCurrentStep] = useState<number>(0);

    return (
        <div className="p-16 space-y-4">
            <Stepper formSteps={formSteps} currentStep={currentStep} />
            <div className="flex justify-between">
                <Button
                    variant="clinqo"
                    className="p-2"
                    onClick={() => setCurrentStep((c) => c - 1)}
                    disabled={currentStep == 0}
                >
                    <BsChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="clinqo"
                    className="p-2"
                    onClick={() => setCurrentStep((c) => c + 1)}
                    disabled={currentStep == formSteps.length - 1}
                >
                    <BsChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
};
