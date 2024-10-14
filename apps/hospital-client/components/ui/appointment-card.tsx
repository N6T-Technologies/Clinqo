"use client";

import { Card, CardTitle } from "./card";
import { useEffect, useState } from "react";
import { DoctorAppointmentData } from "@/app/(protected)/console/@doctor/appointments/page";
import { useRecoilValue } from "recoil";
import { sessionAtom } from "@/store/atoms/sessionAtom";

export default function AppointmentCard({ data }: { data: DoctorAppointmentData[] }) {
    const [appointments, setAppointment] = useState<DoctorAppointmentData[]>([]);
    const currentSession = useRecoilValue(sessionAtom);

    useEffect(() => {
        setAppointment(data);
    }, []);

    return (
        <div className="w-full h-full flex justify-center items-center pb-24 pt-8">
            {appointments.length > 0 ? (
                appointments.map((a) => {
                    return (
                        <Card className="w-full h-full mx-8 p-8">
                            <CardTitle>Appointment: {a.number}</CardTitle>
                        </Card>
                    );
                })
            ) : currentSession ? (
                <Card className="w-full h-full mx-8 p-8 flex justify-center items-center text-xl">
                    {/* //TODO: Replace this with skeleton loading page */}
                    Waiting for appointments...
                </Card>
            ) : (
                <div className="text-2xl">Session Not Found</div>
            )}
        </div>
    );
}
