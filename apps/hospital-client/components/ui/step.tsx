"use client";

import { StepInfo } from "@/types";

export const Step = ({ currentStep, stepInfo }: { currentStep: boolean; stepInfo: StepInfo }) => {
    return (
        <>
            {currentStep ? (
                <div
                    className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                >
                    <span className="text-sm font-medium text-sky-600">{stepInfo.id}</span>
                    <span className="text-sm font-medium">{stepInfo.name}</span>
                </div>
            ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500 transition-colors">{stepInfo.id}</span>
                    <span className="text-sm font-medium">{stepInfo.name}</span>
                </div>
            )}
        </>
    );
};
