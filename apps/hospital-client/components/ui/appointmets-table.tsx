"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(protected)/console/@deskManager/appointments/columns";
import { Appointment } from "@/types";
import { useEffect, useState } from "react";
import { WsManger } from "@/lib/WsManager";
import { Reshipi, Status } from "shefu/appointments";

export default function AppointmentsTable({ data, clinicId }: { data: Appointment[]; clinicId: string }) {
    const [depth, setDepth] = useState<Appointment[]>([]);

    useEffect(() => {
        setDepth(data);

        WsManger.getInstance().registerCallback(
            "new_clinic",
            (data: Reshipi) => {
                console.log("Reached here");
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

        WsManger.getInstance().registerCallback(
            "cancellation_clinic",
            (data: { reshipies: Reshipi[]; removedReshipi: Reshipi }) => {
                setDepth((depth) => {
                    return depth.map((r) => {
                        if (r.id === data.removedReshipi.id) {
                            r.status = Status.Canceled;
                            r.number = 0;
                            return r;
                        }
                        return r;
                    });
                });

                setDepth((depth) => {
                    let j = 0;
                    return depth.map((r) => {
                        if (j < data.reshipies.length && r.id === data.reshipies[j]?.id) {
                            r.number = data.reshipies[j]?.reshipiNumber || r.number;
                            j++;
                            return r;
                        }

                        return r;
                    });
                });
            },
            `cancellation_clinic@${clinicId}`
        );

        WsManger.getInstance().registerCallback(
            "ongoing_clinic",
            (data: Reshipi) => {
                setDepth((depth) => {
                    return depth.map((r) => {
                        if (r.id === data.id) {
                            r.status = Status.Ongoing;
                            return r;
                        }

                        return r;
                    });
                });
            },
            `ongoing_clinic@${clinicId}`
        );

        WsManger.getInstance().sendMessage({
            method: "SUBSCRIBE",
            params: [`new_clinic@${clinicId}`, `cancellation_clinic@${clinicId}`, `ongoing_clinic@${clinicId}`],
        });

        return () => {
            //TODO: We want that the user gets unsubscribe when they leave the page, but it is creating some sort of problem with navigation in the sense that the user is not getting re subscribed even when we get back to this page
            // WsManger.getInstance().sendMessage({
            //     method: "UNSUBSCRIBE",
            //     params: [`new_clinic@${clinicId}`, `cancellation_clinic@${clinicId}`],
            // });
            // WsManger.getInstance().deRegisterCallback("new_clinic", `new_clinic@${clinicId}`);
            // WsManger.getInstance().deRegisterCallback("cancellation_clinic", `cancellation_clinic@${clinicId}`);
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
