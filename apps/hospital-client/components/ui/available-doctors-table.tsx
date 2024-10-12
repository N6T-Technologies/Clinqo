"use client";

import { columns } from "@/app/(protected)/console/@deskManager/doctors/columns";
import { AvailableDoctorTable } from "@/types";
import { DataTable } from "./data-table";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { Errors } from "../../../shefu/src/state/ReshipiBook";
import { WsManger } from "@/lib/WsManager";

function addSubForNewDoctors(
    data: AvailableDoctorTable[],
    type: "total" | "current",
    setNewAvailableDoctors: Dispatch<SetStateAction<AvailableDoctorTable[]>>,
    clinicId: string,
    subscriptions: MutableRefObject<Record<string, string[]>>
) {
    data.forEach((d) => {
        if (subscriptions.current[type]) {
            WsManger.getInstance().deRegisterCallback(type, `${type}@${clinicId}_${d.doctorId}`);
            WsManger.getInstance().sendMessage({
                method: "UNSUBSCRIBE",
                params: [`${type}@${clinicId}_${d.doctorId}`],
            });
        }
        WsManger.getInstance().registerCallback(
            type,
            (updatedNumber: number) => {
                setNewAvailableDoctors((doctors: AvailableDoctorTable[]) => {
                    return doctors.map((doctor: AvailableDoctorTable) => {
                        if (doctor.doctorId === d.doctorId) {
                            if (type === "total") {
                                doctor.total = updatedNumber;
                            } else if (type === "current") {
                                doctor.ongoingNumber = updatedNumber;
                            }
                            return doctor;
                        }
                        return doctor;
                    });
                });
            },
            `${type}@${clinicId}_${d.doctorId}`
        );

        WsManger.getInstance().sendMessage({
            method: "SUBSCRIBE",
            params: [`${type}@${clinicId}_${d.doctorId}`],
        });
        const subscriptionsTotal = subscriptions.current[type] || [];

        subscriptionsTotal.push(`${type}@${clinicId}_${d.doctorId}`);

        subscriptions.current[type] = subscriptionsTotal;
    });
}

function unsubNewDoctors(subscriptions: MutableRefObject<Record<string, string[]>>, type: "total" | "current") {
    if (subscriptions.current[type]) {
        subscriptions.current[type].forEach((sub) => {
            WsManger.getInstance().deRegisterCallback("total", sub);
        });
    }
}

export default function AvailableDoctorsTable({ data, clinicId }: { data: AvailableDoctorTable[]; clinicId: string }) {
    const [newAvailableDoctors, setNewAvailableDoctors] = useState<AvailableDoctorTable[]>([]);
    const [error, setError] = useState<Errors | null>(null);
    const subscriptions = useRef<Record<string, string[]>>({});

    useEffect(() => {
        setNewAvailableDoctors(data);
        addSubForNewDoctors(data, "total", setNewAvailableDoctors, clinicId, subscriptions);
        addSubForNewDoctors(data, "current", setNewAvailableDoctors, clinicId, subscriptions);
        WsManger.getInstance().registerCallback(
            "doctors",
            (data: AvailableDoctorTable[] | Errors) => {
                if (
                    data === Errors.NOT_FOUND ||
                    data === Errors.FORBIDDEN ||
                    data === Errors.BAD_REQUEST ||
                    data === Errors.SOMETHING_WENT_WRONG
                ) {
                    setError(data);
                    return;
                }
                setNewAvailableDoctors(data);
                subscriptions.current = {};

                addSubForNewDoctors(data, "total", setNewAvailableDoctors, clinicId, subscriptions);
                addSubForNewDoctors(data, "current", setNewAvailableDoctors, clinicId, subscriptions);
            },
            `doctors@${clinicId}`
        );

        WsManger.getInstance().sendMessage({ method: "SUBSCRIBE", params: [`doctors@${clinicId}`] });
        return () => {
            WsManger.getInstance().deRegisterCallback("doctors", `doctors@${clinicId}`);
            WsManger.getInstance().sendMessage({ method: "UNSUBSCRIBE", params: [`doctors@${clinicId}`] });
            unsubNewDoctors(subscriptions, "total");
            unsubNewDoctors(subscriptions, "current");
        };
    }, []);

    if (error) {
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
