"use client";

import { Clinic } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Clinic>[] = [
    {
        accessorKey: "name",
        header: "Clinic Name",
    },
    {
        accessorKey: "headName",
        header: "Clinic Head",
    },
    {
        accessorKey: "headEmail",
        header: "Email",
    },
];
