"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(protected)/console/@deskManager/appointments/columns";
import { Appointment } from "@/types";
import { useEffect, useState } from "react";
import { WsManger } from "@/lib/WsManager";
import { Reshipi } from "shefu/appointments";

export default function AppointmentsTable({ data, clinicId }: { data: Appointment[]; clinicId: string }) {
    const [depth, setDepth] = useState<Appointment[]>([]);

    useEffect(() => {
        setDepth(data);

        WsManger.getInstance().registerCallback(
            "new_clinic",
            (data: Reshipi) => {
                console.log("New appointment added");
                console.log(data);

                setDepth((depth) => {
                    const newDepth = [
                        ...depth,
                        {
                            id: data.id,
                            name: data.patientFirstName + " " + data.patientLastName,
                            doctorName: data.doctorName,
                            number: data.reshipiNumber,
                            status: data.status,
                        },
                    ];
                    return newDepth;
                });
            },
            `new_clinic@${clinicId}`
        );

        WsManger.getInstance().sendMessage({ method: "SUBSCRIBE", params: [`new_clinic@${clinicId}`] });

        return () => {
            WsManger.getInstance().sendMessage({ method: "UNSUBSCRIBE", params: [`new_clinic@${clinicId}`] });
            WsManger.getInstance().deRegisterCallback("new_clinic", `new_clinic@${clinicId}`);
        };
    }, []);

    return (
        <div className="w-full h-4/5 px-14 pt-14">
            <DataTable
                heading="Appointments"
                filterField="name"
                searchBoxPlaceholder="Fliter Patients..."
                className="bg-white"
                columns={columns}
                data={depth}
            />
        </div>
    );
}
