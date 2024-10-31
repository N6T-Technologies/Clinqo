"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
    { gender: "male", patients: 275, fill: "var(--color-male)" },
    { gender: "female", patients: 310, fill: "var(--color-female)" },
    { gender: "other", patients: 15, fill: "var(--color-other)" },
];

const chartConfig = {
    patients: {
        label: "Patients",
    },
    male: {
        label: "Male",
        color: "hsl(210, 70%, 60%)",
    },
    female: {
        label: "Female",
        color: "hsl(350, 70%, 60%)",
    },
    other: {
        label: "Other",
        color: "hsl(150, 70%, 60%)",
    },
};

export default function ClinicGenderDistribution() {
    const totalPatients = chartData.reduce((sum, { patients }) => sum + patients, 0);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-2">
                <CardTitle>Weekly Patient Gender Distribution</CardTitle>
                <CardDescription>Hospital Admissions by Gender</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="w-full mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie data={chartData} dataKey="patients" label nameKey="gender" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">Total patients this week: {totalPatients}</div>
            </CardFooter>
        </Card>
    );
}
