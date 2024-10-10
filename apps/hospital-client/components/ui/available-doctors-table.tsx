"use client";

import { columns } from "@/app/(protected)/console/@deskManager/doctors/columns";
import { AvailableDoctorTable } from "@/types";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { Errors } from "../../../shefu/src/state/ReshipiBook";
import { WsManger } from "@/lib/WsManager";

export default function AvailableDoctorsTable({ data, clinicId }: { data: AvailableDoctorTable[]; clinicId: string }) {
    const [newAvailableDoctors, setNewAvailableDoctors] = useState<AvailableDoctorTable[] | Errors>([]);

    useEffect(() => {
        setNewAvailableDoctors(data);
        WsManger.getInstance().registerCallback(
            "doctors",
            (data: AvailableDoctorTable[]) => {
                setNewAvailableDoctors(data);
            },
            `doctors@${clinicId}`
        );

        WsManger.getInstance().sendMessage({ method: "SUBSCRIBE", params: [`doctors@${clinicId}`] });
        console.log(WsManger.getInstance().getCallabcks("doctors"));
        return () => {
            WsManger.getInstance().deRegisterCallback("doctors", `doctors@${clinicId}`);
            WsManger.getInstance().sendMessage({ method: "UNSUBSCRIBE", params: [`doctors@${clinicId}`] });
        };
    }, []);

    if (
        newAvailableDoctors === Errors.NOT_FOUND ||
        newAvailableDoctors === Errors.BAD_REQUEST ||
        newAvailableDoctors === Errors.FORBIDDEN
    ) {
        return (
            <div className="w-full h-[38rem] px-14 pt-14 mb-14">
                <DataTable
                    heading="Available Doctors"
                    filterField="doctorName"
                    searchBoxPlaceholder="Fliter Doctors..."
                    className="bg-white"
                    columns={columns}
                    data={[]}
                    noRegisterButton
                />
            </div>
        );
    }

    return (
        <div className="w-full h-[38rem] px-14 pt-14 mb-14">
            <DataTable
                heading="Available Doctors"
                filterField="doctorName"
                searchBoxPlaceholder="Fliter Doctors..."
                className="bg-white"
                columns={columns}
                data={newAvailableDoctors}
                noRegisterButton
            />
        </div>
    );
}
