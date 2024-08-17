"use client";

import { Header } from "./header";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
}

export const CardWrapper = ({ children, headerLabel }: CardWrapperProps) => {
    return (
        <div className="w-2/4 space-y-6">
            <div>
                <Header label={headerLabel} />
            </div>
            <div>{children}</div>
        </div>
    );
};
