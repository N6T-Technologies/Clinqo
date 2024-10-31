"use client";

import { Appointment } from "@/types";
import DataCard from "./data-card";
import { FaClipboardList } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import AppointmentsTable from "./appointmets-table";

export default function DeskManagerDashboard({ clinicId, data }: { clinicId: string; data: Appointment[] }) {
    return (
        <div className="h-full px-16 py-12">
            <div className="flex gap-x-12">
                <DataCard
                    data="2648"
                    description="Avg. Appointments Booked/Week"
                    icon={<FaClipboardList className="bg-[#F5E6FE] text-[#BE63F9] rounded-lg size-12 p-2" />}
                />
                <DataCard
                    data="15000"
                    description="Avg. Revenue/Week"
                    icon={<RiMoneyRupeeCircleFill className="bg-[#CEFFE7] text-[#339259] rounded-lg size-12 p-2" />}
                />
            </div>
            <AppointmentsTable data={data} clinicId={clinicId} dashboard />
        </div>
    );
}
