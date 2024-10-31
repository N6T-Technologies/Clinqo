"use client";

import { ReactNode } from "react";
import { Card } from "./card";

export default function DataCard({
    icon,
    data,
    description,
}: {
    icon?: ReactNode;
    data: string;
    description?: string;
}) {
    return (
        <Card className="flex justify-center px-6 py-4 rounded-lg items-end gap-x-4">
            <div>{icon}</div>
            <div>
                <div className="text-xl font-semibold leading-none tracking-tight">{data}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
            </div>
        </Card>
    );
}
