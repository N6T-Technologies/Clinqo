"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AllClinicTable } from "@/types";
import { ReactNode, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "./data-table";
import { startSession } from "@/actions/start-session";
import { endSession } from "@/actions/end-session";

const Header = ({ header, icon }: { header: string; icon?: ReactNode }) => {
    return (
        <div className="flex font-extrabold text-md justify-center items-center">
            {header}
            {icon && icon}
        </div>
    );
};

const CellStyles = ({ text }: { text: string | number }) => {
    return <div className="font-normal text-center">{text}</div>;
};

export default function DoctorClinicTable({
    data,
    currentSession,
}: {
    data: AllClinicTable[] | undefined;
    currentSession: string | undefined;
}) {
    const [activeSwitchId, setActiveSwitchId] = useState<string | null>(null);

    useEffect(() => {
        if (currentSession) {
            setActiveSwitchId(currentSession);
        }
    });

    const handleSwitchToggle = async (id: string) => {
        if (activeSwitchId === id) {
            const result = await endSession(id);
            setActiveSwitchId(null);
            if (!result.ok) {
                setActiveSwitchId(id);
            }
        } else {
            const result = await startSession(id);
            setActiveSwitchId(id);
            if (!result.ok) {
                setActiveSwitchId(null);
            }
        }
    };

    const columns: ColumnDef<AllClinicTable>[] = [
        {
            accessorKey: "srNo",
            header: () => <Header header="Sr No" />,
            cell: ({ row }) => <CellStyles text={row.index + 1} />,
        },
        {
            accessorKey: "name",
            header: () => <Header header="Clinic Name" />,
            cell: ({ row }) => <CellStyles text={row.getValue("name")} />,
        },
        {
            accessorKey: "timing",
            header: () => <Header header="Timing " />,
            cell: ({ row }) => <CellStyles text={row.getValue("timing")} />,
        },
        {
            id: "activeSwitch",
            header: () => <Header header="Start" />,
            cell: ({ row }) => {
                return (
                    <div className="flex justify-center items-center">
                        <Switch
                            checked={activeSwitchId === row.original.id}
                            onCheckedChange={() => handleSwitchToggle(row.original.id)}
                            disabled={activeSwitchId !== null && activeSwitchId !== row.original.id}
                        />
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const clinic = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {/* //TODO: Add buttons to do specific things */}
                            <DropdownMenuItem>Change Timing</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    console.log(clinic.id);
                                }}
                            >
                                View Clinic
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="w-full h-5/6 px-14 pt-14">
            <DataTable
                heading="All Clinics"
                filterField="name"
                searchBoxPlaceholder="Fliter Clinics..."
                className="bg-white"
                columns={columns}
                data={data || []}
                noRegisterButton
            />
        </div>
    );
}
