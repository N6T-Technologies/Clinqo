"use client";

import { Reshipi } from "shefu/appointments";
import { Card } from "./card";

export default function AppointmentCard({
    reshipies,
}: {
    reshipies:
        | {
              reshipiNumber: number;
              reshipiInfo: Omit<Reshipi, "reshipiNumber" | "doctorName">;
          }[]
        | undefined;
}) {
    return (
        <div className="w-full h-full flex justify-center items-center pb-24 pt-8">
            <Card className="w-full h-full mx-8 p-8">Appointment Card</Card>
        </div>
    );
}
