"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Appointment } from "@/types";
import { ReactNode } from "react";
import { Status } from "shefu/appointments";
import PrintPrescriptionButton from "@/components/ui/print-prescription-button-simple";

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

const RenderStatus = ({ status }: { status: Status }) => {
    return (
        <div className="font-semibold text-center">
            {status === Status.Ongoing ? (
                <div className="text-green-700">{status}</div>
            ) : status === Status.Canceled ? (
                <div className="text-red-700">{status}</div>
            ) : status === Status.Created ? (
                <div className="text-clinqoNormal">{status}</div>
            ) : status === Status.Paused ? (
                <div className="text-gray-500">{status}</div>
            ) : (
                <div>{status}</div>
            )}
        </div>
    );
};

export const columns: ColumnDef<Appointment>[] = [
    {
        accessorKey: "number",
        header: () => <Header header="Sr No" />,
        cell: ({ row }) => <CellStyles text={row.getValue("number")} />,
    },
    {
        accessorKey: "name",
        header: () => <Header header="Patient Name" />,
        cell: ({ row }) => <CellStyles text={row.getValue("name")} />,
    },
    {
        accessorKey: "doctorName",
        header: () => <Header header="Doctor Name" />,
        cell: ({ row }) => <CellStyles text={row.getValue("doctorName")} />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <Header header="Status" icon={<ArrowUpDown className="ml-2 h-4 w-4" />} />
                </Button>
            );
        },
        cell: ({ row }) => <RenderStatus status={row.getValue("status")} />,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const appointment = row.original;
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(appointment.id)}>
                            Copy Id
                        </DropdownMenuItem>                        <DropdownMenuSeparator />
                        {/* //TODO: Add buttons to do specific things */}
                        <DropdownMenuItem>View Appointment</DropdownMenuItem>
                        <DropdownMenuItem>View Doctor</DropdownMenuItem>
                        <DropdownMenuSeparator />                        <DropdownMenuItem asChild>
                            <PrintPrescriptionButton
                                appointmentId={appointment.id}
                                patientName={appointment.name}
                                doctorName={appointment.doctorName}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start p-2 h-auto font-normal"
                            />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
