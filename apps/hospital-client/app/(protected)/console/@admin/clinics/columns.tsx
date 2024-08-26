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

import { Clinic } from "@/types";
import { ReactNode } from "react";

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

export const columns: ColumnDef<Clinic>[] = [
    {
        accessorKey: "Sr No",
        header: () => <Header header="Sr No" />,
        cell: ({ row }) => <CellStyles text={row.index + 1} />,
    },
    {
        accessorKey: "name",
        header: () => <Header header="Clinic Name" />,
        cell: ({ row }) => <CellStyles text={row.getValue("name")} />,
    },
    {
        accessorKey: "headName",
        header: () => <Header header="Clinic Head" />,
        cell: ({ row }) => <CellStyles text={row.getValue("headName")} />,
    },
    {
        accessorKey: "headEmail",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <Header header="Email" icon={<ArrowUpDown className="ml-2 h-4 w-4" />} />
                </Button>
            );
        },
        cell: ({ row }) => <CellStyles text={row.getValue("headEmail")} />,
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(clinic.headEmail)}>
                            Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Clinic</DropdownMenuItem>
                        <DropdownMenuItem>View Clinic Head</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
