"use client";

import { StepInfo } from "@/types";
import { Step } from "./step";
import { useState } from "react";
import { Button } from "./button";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export const Stepper = ({ formSteps }: { formSteps: StepInfo[] }) => {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div className="space-y-4">
            <nav aria-label="Progress">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                    {formSteps.map((step, index) => (
                        <li key={step.id} className="md:flex-1">
                            <Step stepInfo={step} currentStep={index === currentStep} />
                        </li>
                    ))}
                </ol>
            </nav>
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
