"use client";

import { Header } from "./header";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    title: string;
}

export const CardWrapper = ({ children, headerLabel, title }: CardWrapperProps) => {
    return (
        <div className="w-2/4 space-y-6">
            <div>
                <Header label={headerLabel} title={title} />
            </div>
            <div>{children}</div>
        </div>
    );
};
