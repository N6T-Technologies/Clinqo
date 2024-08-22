"use client";

import { Clinic } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

const Header = ({ header }: { header: string }) => {
    return <div className="font-extrabold text-md text-center">{header}</div>;
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
        header: () => <Header header="Email" />,
        cell: ({ row }) => <CellStyles text={row.getValue("headEmail")} />,
    },
];
