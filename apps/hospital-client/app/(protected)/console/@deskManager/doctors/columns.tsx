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

import { ReactNode } from "react";
import { AvailableDoctorTable } from "@/types";

const Header = ({ header, icon }: { header: string; icon?: ReactNode }) => {
    return (
        <div className="flex font-extrabold text-md justify-center items-center">
            {header}
            {icon && icon}
        </div>
    );
};

const CellStyles = ({ text }: { text: string | number }) => {
    return <div className="font-normal text-center ">{text}</div>;
};

export const columns: ColumnDef<AvailableDoctorTable>[] = [
    {
        accessorKey: "srNo",
        header: () => <Header header="Sr No" />,
        cell: ({ row }) => <CellStyles text={row.index + 1} />,
    },
    {
        accessorKey: "doctorName",
        header: () => <Header header="Doctor Name" />,
        cell: ({ row }) => <CellStyles text={row.getValue("doctorName")} />,
    },
    {
        accessorKey: "ongoingNumber",
        header: () => <Header header="Ongoing Number" />,
        cell: ({ row }) => <CellStyles text={row.getValue("ongoingNumber")} />,
    },
    {
        accessorKey: "total",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <Header header="Total Count" icon={<ArrowUpDown className="ml-2 h-4 w-4" />} />
                </Button>
            );
        },
        cell: ({ row }) => <CellStyles text={row.getValue("total")} />,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const doctor = row.original;
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(doctor.doctorId)}>
                            Copy Id
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Doctor</DropdownMenuItem>
                        <DropdownMenuItem>View Appointments</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
