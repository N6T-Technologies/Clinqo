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
import { ReactNode, useEffect, useOptimistic, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { DataTable } from "./data-table";
import { startSession } from "@/actions/start-session";
import { endSession } from "@/actions/end-session";
import { useToast } from "@/hooks/use-toast";
import { useRecoilState } from "recoil";
import { sessionAtom } from "@/store/atoms/sessionAtom";
import { revalidatePath } from "next/cache";

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
    doctorId,
    dashboard,
}: {
    data: AllClinicTable[] | undefined;
    doctorId: string;
    dashboard?: boolean;
}) {
    const [activeSwitchId, setActiveSwitchId] = useRecoilState(sessionAtom);

    const [optimisticSwitchId, setOptimisticSwitchId] = useOptimistic(
        activeSwitchId,
        (state, newActiceSwitchId: string | null) => {
            return newActiceSwitchId;
        }
    );

    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/session", {
                next: { revalidate: false },
                method: "POST",
                body: JSON.stringify({ doctorId: doctorId }),
            });

            const data = await res.json();
            if (data.ok) {
                setActiveSwitchId(data.currentSessionId);
            } else {
                setActiveSwitchId(null);
            }
        };

        fetchData();
    }, []);

    const handleSwitchToggle = async (id: string) => {
        if (activeSwitchId === id) {
            setOptimisticSwitchId(null);
            const result = await endSession(id);

            if (result.ok) {
                setActiveSwitchId(null);
            } else if (!result.ok) {
                toast({
                    variant: "destructive",
                    title: `${result.error}`,
                    description: `This error is not fetal, Try Reloading`,
                });
                revalidatePath("/console/clinics");
            }
        } else {
            setOptimisticSwitchId(id);
            const result = await startSession(id);
            console.log("on");

            if (result.ok) {
                setActiveSwitchId(id);
            } else if (!result.ok) {
                toast({
                    variant: "destructive",
                    title: `${result.error}`,
                    description: `This error is not fetal, Try Reloading`,
                });
                revalidatePath("/console/clinics");
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
                            checked={optimisticSwitchId === row.original.id}
                            onCheckedChange={() => handleSwitchToggle(row.original.id)}
                            disabled={optimisticSwitchId !== null && optimisticSwitchId !== row.original.id}
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
        <div className={dashboard ? "w-full h-3/4 mt-6" : "w-full h-5/6 px-14 pt-14"}>
            <DataTable
                heading="All Clinics"
                filterField="name"
                searchBoxPlaceholder="Fliter Clinics..."
                className="bg-white"
                columns={columns}
                data={data || []}
                noRegisterButton
                dashboard={dashboard}
            />
        </div>
    );
}
