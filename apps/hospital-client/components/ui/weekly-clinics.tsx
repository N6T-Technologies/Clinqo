"use client";

import { CartesianGrid, Dot, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
    { week: "Week 1", clinics: 42, fill: "hsl(var(--chart-1))" },
    { week: "Week 2", clinics: 38, fill: "hsl(var(--chart-2))" },
    { week: "Week 3", clinics: 45, fill: "hsl(var(--chart-3))" },
    { week: "Week 4", clinics: 40, fill: "hsl(var(--chart-4))" },
    { week: "Week 5", clinics: 47, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
    clinics: {
        label: "Clinics",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export default function WeeklyClinicChart() {
    return (
        <ChartContainer config={chartConfig} className="h-full w-full pb-24 pr-16 m-0">
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                    top: 24,
                    right: 24,
                    bottom: 24,
                    left: 24,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" />
                <YAxis className="p-0 m-0" />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" nameKey="clinics" hideLabel />}
                />
                <Line
                    dataKey="clinics"
                    type="natural"
                    stroke="var(--color-clinics)"
                    strokeWidth={2}
                    dot={({ payload, ...props }) => (
                        <Dot
                            key={payload.week}
                            r={5}
                            cx={props.cx}
                            cy={props.cy}
                            fill={payload.fill}
                            stroke={payload.fill}
                        />
                    )}
                />
            </LineChart>
        </ChartContainer>
    );
}
