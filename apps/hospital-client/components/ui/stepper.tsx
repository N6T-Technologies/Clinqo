"use client";

import { StepInfo } from "@/types";
import { Step } from "./step";

export const Stepper = ({ formSteps, currentStep }: { formSteps: StepInfo[]; currentStep: number }) => {
    return (
        <div>
            <nav aria-label="Progress">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                    {formSteps.map((step, index) => (
                        <li key={step.id} className="md:flex-1">
                            <Step stepInfo={step} currentStep={index === currentStep} />
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};
