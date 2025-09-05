"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Doctor } from "@/types";
import { ReactNode, useState } from "react";
import { deleteDoctor } from "@/actions/delete-doctor";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

const DoctorActionsCell = ({ doctor }: { doctor: Doctor }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteDoctor(doctor.id);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Doctor deleted successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to delete doctor",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleViewDoctor = () => {
        router.push(`/console/doctors/${doctor.id}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="text-black bg-transparent hover:bg-gray-200 h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(doctor.doctorEmail)}>
                    Copy Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewDoctor}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Doctor
                </DropdownMenuItem>
                {/* <DropdownMenuItem>Message Doctor</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Doctor
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete Dr. {doctor.doctorName.replace('Dr. ', '')} 
                                from your clinic and remove all associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<Doctor>[] = [
    {
        accessorKey: "Sr No",
        header: () => <Header header="Sr No" />,
        cell: ({ row }) => <CellStyles text={row.index + 1} />,
    },
    {
        accessorKey: "doctorName",
        header: () => <Header header="Doctor Name" />,
        cell: ({ row }) => <CellStyles text={row.getValue("doctorName")} />,
    },
    {
        accessorKey: "timing",
        header: () => <Header header="Timing " />,
        cell: ({ row }) => <CellStyles text={row.getValue("timing")} />,
    },
    {
        accessorKey: "doctorEmail",
        header: ({ column }) => {
            return (
                <Button className="bg-transparent hover:bg-gray-100" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    <Header header="Email" icon={<ArrowUpDown className="ml-2 h-4 w-4" />} />
                </Button>
            );
        },
        cell: ({ row }) => <CellStyles text={row.getValue("doctorEmail")} />,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const doctor = row.original;
            return <DoctorActionsCell doctor={doctor} />;
        },
    },
];
